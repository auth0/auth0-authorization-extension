import Joi from 'joi';
import _ from 'lodash';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/roles',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get the roles for a user.',
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getRoles()
      .then(roles => _.filter(roles, (role) => _.includes(role.users, req.params.id)))
      .then(roles => roles.map((role) => ({
        _id: role._id,
        name: role.name,
        applicationId: role.applicationId,
        description: role.description
      })))
      .then(groups => reply(groups))
      .catch(err => reply.error(err))
});
