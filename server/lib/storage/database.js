import _ from 'lodash';
import Promise from 'bluebird';
import { ArgumentError } from 'auth0-extension-tools';

export default class Database {
  constructor(options = { }) {
    if (!options.provider) {
      throw new ArgumentError('The \'provider\' has to be set when initializing the database.');
    }

    this.provider = options.provider;
  }

  importData(data) {
    const promises = [];

    const assemblePromises = (collection, array) => {
      _.forEach(array, item => {
        promises.push(this.provider.update(collection, item._id, item, true)); // eslint-disable-line no-underscore-dangle
      });
    };

    _.forEach(data, (item, key) => {
      if (item && item.length) {
        assemblePromises(key, item);
      }
    });
    // TODO: fix this later
    return Promise.all(promises);
  }

  getConfiguration() {
    return this.provider
      .getAll('configuration')
      .then(records => (records.length ? records[0] : null));
  }

  updateConfiguration(config) {
    return this.provider
      .update('configuration', 'v1', config, true);
  }

  getRules() {
    return this.provider
      .getAll('rules');
  }

  createRule(rule) {
    return this.provider
      .create('rules', rule);
  }

  getPermissions() {
    return this.provider
      .getAll('permissions');
  }

  getPermission(id) {
    return this.provider
      .get('permissions', id);
  }

  createPermission(permission) {
    return this.provider
      .create('permissions', permission);
  }

  updatePermission(id, permission) {
    return this.provider
      .update('permissions', id, permission);
  }

  deletePermission(id) {
    return this.provider
      .delete('permissions', id);
  }

  getRoles() {
    return this.provider
      .getAll('roles');
  }

  getRole(id) {
    return this.provider
      .get('roles', id);
  }

  createRole(role) {
    return this.provider
      .create('roles', role);
  }

  updateRole(id, role) {
    return this.provider
      .update('roles', id, role);
  }

  deleteRole(id) {
    return this.provider
      .delete('roles', id);
  }

  getGroups() {
    return this.provider
      .getAll('groups');
  }

  getGroup(id) {
    return this.provider
      .get('groups', id);
  }

  createGroup(group) {
    return this.provider
      .create('groups', group);
  }

  updateGroup(id, group) {
    return this.provider
      .update('groups', id, group);
  }

  deleteGroup(id) {
    return this.provider
      .delete('groups', id);
  }

  getApplications() {
    return this.provider
      .getAll('applications');
  }

  getApplication(clientId) {
    return this.provider
      .get('applications', clientId);
  }

  updateApplication(clientId, application) {
    return this.provider
      .update('applications', clientId, application, true);
  }
}
