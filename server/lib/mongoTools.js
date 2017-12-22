import Promise from 'bluebird';

export const mongoExport = storage =>
  Promise.props({
    groups: storage.getGroups(),
    roles: storage.getRoles(),
    permissions: storage.getPermissions(),
    configuration: storage.getConfiguration()
  });

export const mongoImport = (storage, data) => {
  const groups = Promise.map(data.groups || [], group => storage.createGroup(group));
  const roles = Promise.map(data.roles || [], role => storage.createRole(role));
  const permissions = Promise.map(data.permissions || [], permission => storage.createPermission(permission));
  const steps = [ groups, roles, permissions, storage.updateConfiguration((data.configuration && data.configuration[0]) || {}) ];

  return Promise.all(steps);
};
