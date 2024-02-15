import Joi from 'joi';
import _ from 'lodash';

export default () => ({
  method: 'GET',
  path: '/api/users/{id}/roles',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get the roles for a user.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
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
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
