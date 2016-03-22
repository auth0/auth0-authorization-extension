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
  const groups = userGroups || [];

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
 * Get the groups a user belongs to.
 */
export function getUserGroups(db, userId) {
  return new Promise((resolve, reject) => {
    getGroupsCached(db, (err, groups) => {
      if (err) {
        return reject(err);
      }

      const userGroups = _.filter(groups, (group) => _.includes(group.members, userId))
        .map((group) => group.name);
      return resolve(userGroups);
    });
  });
}

/*
 * Match a connection/group memberships to a mapping.
 */
const matchMapping = (mapping, connectionId, groupMemberships) => {
  return mapping.connectionId === connectionId && groupMemberships.indexOf(mapping.groupName) > -1;
};

/*
 * Match a connection/group memberships to multiple mappings.
 */
const matchMappings = (mappings, connectionId, groupMemberships) => {
  return mappings &&
    _.filter(mappings, (mapping) => matchMapping(mapping, connectionId, groupMemberships)).length > 0;
};

/*
 * Calculate dynamic group memberships.
 */
export function getDynamicUserGroups(db, connectionId, groupMemberships) {
  return new Promise((resolve, reject) => {
    if (!connectionId) {
      return resolve([]);
    }

    if (!groupMemberships || groupMemberships.length === 0) {
      return resolve([]);
    }

    return getGroupsCached(db, (err, groups) => {
      if (err) {
        return reject(err);
      }

      const userGroups = _.filter(groups, (group) => matchMappings(group.mappings, connectionId, groupMemberships));
      return resolve(userGroups.map(group => group.name));
    });
  });
}
