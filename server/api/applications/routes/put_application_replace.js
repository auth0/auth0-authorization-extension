import _ from 'lodash';
import Promise from 'bluebird';
import Joi from 'joi';

module.exports = (server) => ({
  method: 'PUT',
  path: '/api/applications/replace',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:applications' ]
    },
    description: 'Replace applicationId for all records',
    validate: {
      payload: {
        old: Joi.string().guid().required(),
        new: Joi.string().guid().required()
      }
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    req.storage.getRoles()
      .then(roles => _.filter(roles, role => role.applicationId === req.payload.old)
        .map(role => ({ ...role, applicationId: req.payload.new })))
      .then(roles => Promise.mapSeries(roles, role => req.storage.updateRole(role._id, role)))
      .then(() => req.storage.getPermissions())
      .then(permissions => _.filter(permissions, permission => permission.applicationId === req.payload.old)
      .map(permission => ({ ...permission, applicationId: req.payload.new })))
      .then(permissions => Promise.mapSeries(permissions, permission => req.storage.updatePermission(permission._id, permission)))
      .then(() => reply().code(204))
      .catch(err => reply.error(err))
});
