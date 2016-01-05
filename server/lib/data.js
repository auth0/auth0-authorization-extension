import { getProvider } from './providers';

class DashboardData {
  getPermissions() {
    return getProvider()
      .getRecords('permissions');
  }

  getPermission(name) {
    return getProvider()
      .getRecord('permissions', { name });
  }

  createPermission(permission) {
    return getProvider()
      .createRecord('permissions', { name: permission.name }, permission);
  }

  updatePermission(name, permission) {
    return getProvider()
      .updateRecord('permissions', { name }, permission);
  }

  deletePermission(name) {
    return getProvider()
      .deleteRecord('permissions', { name });
  }

  getRoles() {
    return getProvider()
      .getRecords('roles');
  }

  getRole(name) {
    return getProvider()
      .getRecord('roles', { name });
  }

  createRole(role) {
    return getProvider()
      .createRecord('roles', { name: role.name }, role);
  }

  updateRole(name, role) {
    return getProvider()
      .updateRecord('roles', { name }, role);
  }

  deleteRole(name) {
    return getProvider()
      .deleteRecord('roles', { name });
  }

  getGroups() {
    return getProvider()
      .getRecords('groups');
  }

  getGroup(name) {
    return getProvider()
      .getRecord('groups', { name });
  }

  createGroup(group) {
    return getProvider()
      .createRecord('groups', { name: group.name }, group);
  }

  updateGroup(name, group) {
    return getProvider()
      .updateRecord('groups', { name }, group);
  }

  deleteGroup(name) {
    return getProvider()
      .deleteRecord('groups', { name });
  }
}

export default new DashboardData();
