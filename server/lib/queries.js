import _ from 'lodash';
import nconf from 'nconf';
import Promise from 'bluebird';
import memoizer from 'lru-memoizer';

/*
 * Cache applications.
 */
export const getApplicationsCached = memoizer({
  load: (db, callback) => {
    db.getApplications()
      .then(applications => callback(null, applications))
      .catch(err => callback(err));
  },
  hash: (db) => db.hash || 'applications',
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
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
 * Cache groups.
 */
export const getGroupsCached = memoizer({
  load: (db, callback) => {
    db.getGroups()
      .then(groups => callback(null, groups))
      .catch(err => callback(err));
  },
  hash: (db) => db.hash || 'groups',
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
});

/*
 * Check if access for any of the provided groups is allowed
 */
export function isApplicationAccessAllowed(db, clientId, userGroups) {
  const groups = (userGroups || []).map(group => group._id);

  return new Promise((resolve, reject) => {
    getApplicationsCached(db, (err, apps) => {
      if (err) {
        return reject(err);
      }

      const app = _.find(apps, { _id: clientId });
      if (!app || !app.groups || app.groups.length === 0) {
        return resolve(true);
      }

      const accessAllowed = _.filter(app.groups, (groupId) => groups.indexOf(groupId) >= 0).length > 0;
      return resolve(accessAllowed);
    });
  });
}

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
      let group = _.find(groups, { '_id': groupId });
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
  return Object.keys(users).map(userId => {
    return {
      userId,
      group: users[userId]
    };
  });
};

/*
 * Match a connection/group memberships to a mapping.
 */
const matchMapping = (mapping, connectionName, groupMemberships) =>
  mapping.connectionName === connectionName && groupMemberships.indexOf(mapping.groupName) > -1;

/*
 * Match a connection/group memberships to multiple mappings.
 */
const matchMappings = (mappings, connectionName, groupMemberships) => {
  return mappings &&
    _.filter(mappings, (mapping) => matchMapping(mapping, connectionName, groupMemberships)).length > 0;
};

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
  return new Promise((resolve, reject) => {
    getGroupsCached(db, (err, groups) => {
      if (err) {
        return reject(err);
      }

      getDynamicUserGroups(db, connectionName, groupMemberships, groups)
        .then(dynamicGroups => {
          const userGroups = _.filter(groups, (group) => _.includes(group.members, userId));
          const nestedGroups = getParentGroups(groups, _.union(userGroups, dynamicGroups));
          return resolve(nestedGroups);
        })
        .catch(reject);
    });
  });
}
