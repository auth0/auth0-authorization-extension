import _ from 'lodash';
import Promise from 'bluebird';
import { ArgumentError, ValidationError } from 'auth0-extension-tools';
import config from '../config';

const checkUnique = (items = [], errorMessage = 'Record with that identifier is already exists.', id) => {
  if (items.length === 0) {
    return null;
  }

  if (id && items.length === 1 && items[0]._id === id) { // eslint-disable-line no-underscore-dangle
    return null;
  }

  return Promise.reject(new ValidationError(errorMessage));
};

export default class Database {
  constructor(options = {}) {
    if (!options.provider) {
      throw new ArgumentError('The \'provider\' has to be set when initializing the database.');
    }

    this.provider = options.provider;
  }

  getStatus() {
    if (!config('DB_TYPE') || config('DB_TYPE') === 'default') {
      return this.provider.storageContext.read()
        .then(data => ({
          size: Buffer.byteLength(JSON.stringify(data), 'utf8'),
          type: 'default'
        }));
    }

    return { size: null, type: config('DB_TYPE') };
  }

  canChange(type, checkFor, id) {
    return this.provider.getAll(type)
      .then(items => _.filter(items, item => item[checkFor] && _.includes(item[checkFor], id)))
      .then(items => {
        if (items.length) {
          const names = items.map(item => item.name).join(', ');
          const message = `Unable to touch ${checkFor} while used in ${type}: ${names}`;
          return Promise.reject(new ValidationError(message));
        }
        return Promise.resolve();
      });
  }

  getConfiguration() {
    return this.provider
      .getAll('configuration')
      .then(records => (records.length ? records[0] : null));
  }

  updateConfiguration(data) {
    return this.provider
      .update('configuration', 'v1', data, true);
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
    return this.getPermissions()
      .then(permissions =>
        checkUnique(
          permissions.filter(item => item.name === permission.name && item.applicationId === permission.applicationId),
          `Permission with name "${permission.name}" already exists for this application`
        ))
      .then(() => this.provider.create('permissions', permission));
  }

  updatePermission(id, permission) {
    return this.getPermissions()
      .then(permissions =>
        checkUnique(
          permissions.filter(item => item.name === permission.name && item.applicationId === permission.applicationId),
          `Permission with name "${permission.name}" already exists for this application`,
          id
        ))
      .then(() => this.canChange('roles', 'permissions', id))
      .then(() => this.canChange('groups', 'permissions', id))
      .then(() => this.provider.update('permissions', id, permission));
  }

  deletePermission(id) {
    return this.canChange('roles', 'permissions', id)
      .then(() => this.provider.delete('permissions', id));
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
    return this.getRoles()
      .then(roles =>
        checkUnique(
          roles.filter(item => item.name === role.name && item.applicationId === role.applicationId),
          `Role with name "${role.name}" already exists for this application`
        ))
      .then(() => this.provider.create('roles', role));
  }

  updateRole(id, role) {
    return this.getRoles()
      .then(roles =>
        checkUnique(
          roles.filter(item => item.name === role.name && item.applicationId === role.applicationId),
          `Role with name "${role.name}" already exists for this application`,
          id
        ))
      .then(() => this.provider.update('roles', id, role));
  }

  deleteRole(id) {
    return this.canChange('groups', 'roles', id)
      .then(() => this.provider.delete('roles', id));
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
    return this.getGroups()
      .then(groups =>
        checkUnique(
          groups.filter(item => (item.name === group.name)),
          `Group with name "${group.name}" already exists`
        ))
      .then(() => this.provider.create('groups', group));
  }

  updateGroup(id, group) {
    return this.getGroups()
      .then(groups =>
        checkUnique(
          groups.filter(item => (item.name === group.name)),
          `Group with name "${group.name}" already exists`,
          id
        ))
      .then(() => this.provider.update('groups', id, group));
  }


  deleteGroup(id) {
    return this.canChange('groups', 'nested', id)
      .then(() => this.provider.delete('groups', id));
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
