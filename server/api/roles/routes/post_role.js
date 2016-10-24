import _ from 'lodash';
import schema from '../schemas/role';

module.exports = () => ({
  method: 'POST',
  path: '/api/roles',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'create:roles' ]
    },
    description: 'Create a new role.',
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const role = req.payload;
    return req.storage.getPermissions()
      .then(permissions => {
        role.permissions.forEach(permissionId => {
          const permission = _.find(permissions, { _id: permissionId });
          if (permission && permission.applicationId !== role.applicationId) {
            throw new Error(`The permission '${permission.name}' is linked to a different application.`);
          }
        });

        return req.storage.createRole(role)
          .then((created) => reply(created));
      })
      .catch(err => reply.error(err));
  }
});
