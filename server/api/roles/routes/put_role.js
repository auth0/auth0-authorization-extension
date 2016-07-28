import _ from 'lodash';
import Joi from 'joi';
import schema from '../schemas/role';

module.exports = () => ({
  method: 'PUT',
  path: '/api/roles/{id}',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Update a role.',
    validate: {
      options: {
        allowUnknown: false
      },
      params: {
        id: Joi.string().guid().required()
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
      })
      .then(() => req.storage.getRole(req.params.id))
      .then(existingRole => {
        if (existingRole.applicationId !== role.applicationId) {
          throw new Error('The \'applicationId\' of a role cannot be changed.');
        }

        return req.storage.updateRole(req.params.id, role)
          .then((created) => reply(created));
      })
      .catch(err => reply.error(err));
  }
});
