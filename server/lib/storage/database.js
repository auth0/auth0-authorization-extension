import { ArgumentError } from '../errors';

export default class Database {
  constructor(options = { }) {
    if (!options.provider) {
      throw new ArgumentError('The \'provider\' has to be set when initializing the database.');
    }

    this.provider = options.provider;
  }

  getPermissions() {
    return this.provider
      .getRecords('permissions');
  }

  getPermission(id) {
    return this.provider
      .getRecord('permissions', id);
  }

  createPermission(permission) {
    return this.provider
      .createRecord('permissions', permission);
  }

  updatePermission(id, permission) {
    return this.provider
      .updateRecord('permissions', id, permission);
  }

  deletePermission(id) {
    return this.provider
      .deleteRecord('permissions', id);
  }

  getRoles() {
    return this.provider
      .getRecords('roles');
  }

  getRole(name) {
    return this.provider
      .getRecord('roles', { name });
  }

  createRole(role) {
    return this.provider
      .createRecord('roles', { name: role.name }, role);
  }

  updateRole(id, role) {
    return this.provider
      .updateRecord('roles', id, role);
  }

  deleteRole(id) {
    return this.provider
      .deleteRecord('roles', id);
  }

  getGroups() {
    return this.provider
      .getRecords('groups');
  }

  getGroup(id) {
    return this.provider
      .getRecord('groups', id);
  }

  createGroup(group) {
    return this.provider
      .createRecord('groups', group);
  }

  updateGroup(id, group) {
    return this.provider
      .updateRecord('groups', id, group);
  }

  deleteGroup(id) {
    return this.provider
      .deleteRecord('groups', id);
  }

  getApplications() {
    return this.provider
      .getRecords('applications');
  }

  getApplication(clientId) {
    return this.provider
      .getRecord('applications', clientId);
  }

  updateApplication(clientId, application) {
    return this.provider
      .updateRecord('applications', clientId, application, true);
  }
}
