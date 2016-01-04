import db from './db';

class DashboardData {
  getPermissions() {
    return db.getRecords('permissions');
  }

  getPermission(name) {
    return db.getRecord('permissions', { name });
  }

  createPermission(permission) {
    return db.createRecord('permissions', { name: permission.name }, permission);
  }

  updatePermission(name, permission) {
    return db.updateRecord('permissions', { name }, permission);
  }

  deletePermission(name) {
    return db.deleteRecord('permissions', { name });
  }

  getRoles() {
    return db.getRecords('roles');
  }

  getRole(name) {
    return db.getRecord('roles', { name });
  }

  createRole(role) {
    return db.createRecord('roles', { name: role.name }, role);
  }

  updateRole(name, role) {
    return db.updateRecord('roles', { name }, role);
  }

  deleteRole(name) {
    return db.deleteRecord('roles', { name });
  }

  getGroups() {
    return db.getRecords('groups');
  }

  getGroup(name) {
    return db.getRecord('groups', { name });
  }

  createGroup(group) {
    return db.createRecord('groups', { name: group.name }, group);
  }

  updateGroup(name, group) {
    return db.updateRecord('groups', { name }, group);
  }

  deleteGroup(name) {
    return db.deleteRecord('groups', { name });
  }
}

export default new DashboardData();
