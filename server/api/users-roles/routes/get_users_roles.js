import Joi from 'joi';
import _ from 'lodash';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the groups for a user.',
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
        description: role.description
      })))
      .then(groups => reply(groups))
      .catch(err => reply.error(err))
});
