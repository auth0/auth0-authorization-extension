import _ from 'lodash';
import schema from '../schemas/role';

export default () => ({
  method: 'POST',
  path: '/api/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'create:roles' ]
    },
    description: 'Create a new role.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: async (req, h) => {
    const role = req.payload;
    const permissions = await req.storage.getPermissions();

    role.permissions.forEach(permissionId => {
      const permission = _.find(permissions, { _id: permissionId });
      if (permission && permission.applicationId !== role.applicationId) {
        throw new Error(`The permission '${permission.name}' is linked to a different application.`);
      }
    });

    const created = await req.storage.createRole(role);
    return h.response(created);
  }
});
