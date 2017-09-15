/* eslint-disable no-underscore-dangle */

import _ from 'lodash';
import nconf from 'nconf';
import Promise from 'bluebird';
import memoizer from 'lru-memoizer';

const compact = (entity) => ({
  _id: entity._id,
  name: entity.name,
  description: entity.description
});

/*
 * Cache connections.
 */
export const getConnectionsCached = memoizer({
  load: (auth0, callback) => {
    auth0.connections.getAll({ fields: 'id,name,strategy' })
      .then(connections => _.chain(connections)
        .sortBy((conn) => conn.name.toLowerCase())
        .value())
      .then(connections => callback(null, connections))
      .catch(err => callback(err));
  },
  hash: (auth0) => auth0.hash || 'connections',
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
});

/*
 * Cache permissions.
 */
export const getPermissionsCached = memoizer({
  load: (db, callback) => {
    db.getPermissions()
      .then(permissions => {
        callback(null, permissions);
      })
      .catch(err => callback(err));
  },
  hash: (db) => db.hash || 'permissions',
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
});

/*
 * Cache roles.
 */
export const getRolesCached = memoizer({
  load: (db, callback) => {
    db.getRoles()
      .then(roles => {
        callback(null, roles);
      })
      .catch(err => callback(err));
  },
  hash: (db) => db.hash || 'roles',
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
});

/*
 * Cache groups.
 */
export const getGroupsCached = memoizer({
  load: (db, callback) => {
    db.getGroups()
      .then(groups => {
        callback(null, groups);
      })
      .catch(err => callback(err));
  },
  hash: (db) => db.hash || 'groups',
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
});

/*
 * Get the full connection names for all mappings.
 */
export const getMappingsWithNames = (auth0, groupMappings) =>
  new Promise((resolve, reject) => {
    getConnectionsCached(auth0, (err, connections) => {
      if (err) {
        return reject(err);
      }

      const mappings = [];
      groupMappings.forEach(m => {
        const connection = _.find(connections, { name: m.connectionName });
        if (connection) {
          const currentMapping = m;
          currentMapping.connectionName = `${connection.name} (${connection.strategy})`;
          mappings.push(currentMapping);
        }
      });

      return resolve(mappings);
    });
  });

/*
 * Resolve all child groups.
 */
export const getChildGroups = (groups, selectedGroups) => {
  const groupsFlat = [];

  // Recursive method to find roles.
  const findGroups = (groupId) => {
    // Only process each role once.
    if (groupsFlat.indexOf(groupId) === -1) {
      groupsFlat.push(groupId);

      // Process the child groups.
      const group = _.find(groups, { _id: groupId });
      if (group && group.nested) {
        _.forEach(group.nested, (nestedId) => {
          findGroups(nestedId);
        });
      }
    }
  };

  // Process the user's groups.
  selectedGroups.forEach(g => findGroups(g._id));

  // Return the groups.
  return _.filter(groups, (g) => groupsFlat.indexOf(g._id) > -1);
};

/*
 * Resolve all parent groups.
 */
export const getParentGroups = (groups, selectedGroups) => {
  const groupsFlat = [];

  // Recursive method to find roles.
  const findGroups = (groupId) => {
    // Only process each role once.
    if (groupsFlat.indexOf(groupId) === -1) {
      groupsFlat.push(groupId);

      // Process the parent groups.
      const parentGroups = _.filter(groups, (group) => _.includes(group.nested || [], groupId));
      parentGroups.forEach(g => findGroups(g._id));
    }
  };

  // Process the user's groups.
  selectedGroups.forEach(g => findGroups(g._id));

  // Return the groups.
  return _.filter(groups, (g) => groupsFlat.indexOf(g._id) > -1);
};

/*
 * Resolve all roles for a list of groups.
 */
export const getRolesForGroups = (selectedGroups, selectedRoles) => {
  const result = [];
  const groups = { };
  selectedGroups.forEach(group => {
    if (group.roles) {
      group.roles.forEach(role => {
        if (!groups[role]) {
          groups[role] = group;
        }
      });
    }
  });

  selectedRoles.forEach(role => {
    if (groups[role._id]) { // eslint-disable-line no-underscore-dangle
      result.push({ role, group: groups[role._id] }); // eslint-disable-line no-underscore-dangle
    }
  });

  return result;
};

/*
 * Get all roles for a user.
 */
export const getRolesForUser = (database, userId) =>
  database.getGroups()
    .then(groups => {
      // get all groups user belong to
      const userGroups = _.filter(groups, (group) => _.includes(group.members, userId));
      return getParentGroups(groups, userGroups)
        .filter(group => group.roles && group.roles.length)
        .map(group => group.roles); // return roles for user's groups and their parents
    })
    .then(roles => _.uniq(_.flattenDeep(roles)))
    .then(roleIds =>
      database.getRoles()
        .then(roles => {
          const groupRoles = _.filter(roles, role => _.includes(roleIds, role._id));
          const userRoles = _.filter(roles, role => role.users && _.includes(role.users, userId));
          return _.uniq([ ...groupRoles, ...userRoles ], '_id');
        })
    );

/*
 * Get all permissions for list of roles.
 */
export const getPermissionsForRoles = (database, userRoles) =>
  database.getPermissions()
    .then(permissions => {
      const permIds = _.flattenDeep(_.map(userRoles, role => role.permissions));
      return permissions.filter(permission => _.includes(permIds, permission._id));
    });

/*
 * Get all permissions for list of roles, grouped by role.
 */
export const getPermissionsByRoles = (database, roles) =>
  new Promise((resolve, reject) => {
    getPermissionsCached(database, (err, permissions) => {
      if (err) {
        return reject(err);
      }

      const rolesList = [];
      _.forEach(roles, (role) => {
        const rolePermissions = permissions.filter(permission => _.includes(role.permissions, permission._id));

        rolesList.push({
          ...role,
          permissions: _.map(rolePermissions, permission =>
            ({ _id: permission._id, name: permission.name, description: permission.description })
          )
        });
      });

      return resolve(rolesList);
    });
  });

/*
 * Resolve all users for a list of groups.
 */
export const getMembers = (selectedGroups) => {
  const users = { };

  // Process the user's groups.
  selectedGroups.forEach(g => {
    if (g.members) {
      g.members.forEach(m => {
        if (!users[m]) {
          users[m] = g;
        }
      });
    }
  });

  // Return the users.
  return Object.keys(users).map(userId => ({
    userId,
    group: users[userId]
  }));
};

/*
 * Match a connection/group memberships to a mapping.
 */
const matchMapping = (mapping, connectionName, groupMemberships) =>
  mapping.connectionName === connectionName && groupMemberships.indexOf(mapping.groupName) > -1;

/*
 * Match a connection/group memberships to multiple mappings.
 */
const matchMappings = (mappings, connectionName, groupMemberships) =>
  mappings &&
    _.filter(mappings, (mapping) => matchMapping(mapping, connectionName, groupMemberships)).length > 0;

/*
 * Calculate dynamic group memberships.
 */
export function getDynamicUserGroups(db, connectionName, groupMemberships, allGroups) {
  return new Promise((resolve, reject) => {
    if (!connectionName) {
      return resolve([]);
    }

    if (!groupMemberships || groupMemberships.length === 0) {
      return resolve([]);
    }

    const getGroups = (cb) => {
      if (allGroups && allGroups.length) {
        return cb(null, allGroups);
      }

      return getGroupsCached(db, cb);
    };

    return getGroups((err, groups) => {
      if (err) {
        return reject(err);
      }

      const dynamicGroups = _.filter(groups, (group) => matchMappings(group.mappings, connectionName, groupMemberships));
      return resolve(dynamicGroups);
    });
  });
}

/*
 * Get the groups a user belongs to.
 */
export function getUserGroups(db, userId, connectionName, groupMemberships) {
  if (!Array.isArray(groupMemberships) || groupMemberships === undefined || groupMemberships === null) {
    groupMemberships = [ ]; // eslint-disable-line no-param-reassign
  }

  return new Promise((resolve, reject) => {
    getGroupsCached(db, (err, groups) => {
      if (err) {
        return reject(err);
      }

      // Get the direct groups memberships of a user.
      const userGroups = _.filter(groups, (group) => _.includes(group.members, userId));

      // Calculate the dynamic user groups based on external and internal group memberships.
      return getDynamicUserGroups(db, connectionName, [ ...groupMemberships, ...(userGroups.map(g => g.name)) ], groups)
        .then(dynamicGroups => {
          const nestedGroups = getParentGroups(groups, _.union(userGroups, dynamicGroups));
          return resolve(nestedGroups);
        })
        .catch(reject);
    });
  });
}

/*
 * Get expanded group data
 */
export function getGroupExpanded(db, groupId) {
  return new Promise((resolve, reject) => {
    getGroupsCached(db, (error, groups) => {
      if (error) {
        return reject(error);
      }

      return getRolesCached(db, (err, allRoles) => {
        if (err) {
          return reject(err);
        }
        const currentGroup = _.find(groups, { _id: groupId });
        const parentGroups = getParentGroups(groups, [ currentGroup ]).filter(g => g._id !== currentGroup._id);

        const roles = getRolesForGroups([ currentGroup, ...parentGroups ], allRoles).map(r => r.role);
        const formatRole = (r) => ({
          _id: r._id,
          name: r.name,
          description: r.description,
          applicationId: r.applicationId,
          applicationType: r.applicationType,
          permissions: r.permissions && r.permissions.map(compact)
        });

        return getPermissionsByRoles(db, roles)
          .then((rolesList) => resolve({
            _id: currentGroup._id,
            name: currentGroup.name,
            description: currentGroup.description,
            roles: rolesList.map(formatRole)
          }));
      });
    });
  });
}

/*
 * Get expanded group data
 */
export function getGroupsExpanded(db, groups) {
  return new Promise((resolve, reject) => {
    getGroupsCached(db, (error, allGroups) => {
      if (error) {
        return reject(error);
      }

      return getRolesCached(db, (err, allRoles) => {
        if (err) {
          return reject(err);
        }

        const groupsWithParents = getParentGroups(allGroups, groups);
        const roles = getRolesForGroups(groupsWithParents, allRoles).map(r => r.role);
        const formatRole = (r) => ({
          _id: r._id,
          name: r.name,
          description: r.description,
          applicationId: r.applicationId,
          applicationType: r.applicationType,
          permissions: r.permissions && r.permissions.map(compact)
        });

        return getPermissionsByRoles(db, roles)
          .then((rolesList) => resolve({
            groups: groupsWithParents.map(compact),
            roles: rolesList.map(formatRole)
          }));
      });
    });
  });
}

const getAllUserGroups = (db, userId) =>
  new Promise((resolve, reject) => {
    getGroupsCached(db, (err, groups) => {
      if (err) {
        return reject(err);
      }

      return resolve(_.filter(groups, (group) => group.members && group.members.indexOf(userId) >= 0));
    });
  });


const getAllUserRoles = (db, userId) =>
  new Promise((resolve, reject) => {
    getRolesCached(db, (err, roles) => {
      if (err) {
        return reject(err);
      }

      return resolve(_.filter(roles, (role) => role.users && role.users.indexOf(userId) >= 0));
    });
  });

const updateUserInGroups = (db, id, newId) =>
  getAllUserGroups(db, id)
    .then(groups => Promise.map(groups, group => {
      const groupId = group._id;
      const index = group.members.indexOf(id);
      group.members[index] = newId; // eslint-disable-line no-param-reassign
      group.members = _.uniq(group.members); // eslint-disable-line no-param-reassign

      return db.updateGroup(groupId, group);
    }));

const updateUserInRoles = (db, id, newId) =>
  getAllUserRoles(db, id)
    .then(roles => Promise.map(roles, role => {
      const roleId = role._id;
      const index = role.users.indexOf(id);
      role.users[index] = newId; // eslint-disable-line no-param-reassign
      role.users = _.uniq(role.users); // eslint-disable-line no-param-reassign

      return db.updateRole(roleId, role);
    }));

const removeUserFromGroups = (db, id) =>
  getAllUserGroups(db, id)
    .then(groups => Promise.map(groups, group => {
      _.pull(group.members, id);
      return db.updateGroup(group._id, group);
    }));

const removeUserFromRoles = (db, id) =>
  getAllUserRoles(db, id)
    .then(roles => Promise.map(roles, role => {
      _.pull(role.users, id);
      return db.updateRole(role._id, role);
    }));

/*
 * Replace userId in all groups and roles
 */
export function updateUserId(db, id, newId) {
  return updateUserInGroups(db, id, newId)
    .then(() => updateUserInRoles(db, id, newId));
}

/*
 * Removes userId from all groups and roles
 */
export function removeUserId(db, id) {
  return removeUserFromGroups(db, id)
    .then(() => removeUserFromRoles(db, id));
}

