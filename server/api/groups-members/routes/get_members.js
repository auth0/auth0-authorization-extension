import Joi from 'joi';

import { getUsersById } from '../../../lib/users';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/members',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the members for a group.',
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: {
        id: Joi.string().guid().required()
      },
      query: {
        per_page: Joi.number().integer().min(1).max(25).default(25),
        page: Joi.number().integer().min(0).default(0)
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroup(req.params.id)
      .then(group => getUsersById(req.pre.auth0, group.members || [], req.query.page, req.query.per_page))
      .then(users => reply(users))
      .catch(err => reply.error(err))
});
