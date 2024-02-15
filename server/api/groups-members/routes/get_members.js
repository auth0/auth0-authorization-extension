import Joi from 'joi';

import { getUsersById } from '../../../lib/users';

export default (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/members',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the members for a group.',
    tags: [ 'api' ],
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      query: Joi.object({
        per_page: Joi.number().integer().min(1).max(25).default(25), // eslint-disable-line newline-per-chained-call
        page: Joi.number().integer().min(0).default(0)
      })
    }
  },
  handler: (req, reply) =>
    req.storage.getGroup(req.params.id)
      .then(group => getUsersById(req.pre.auth0, group.members || [], req.query.page, req.query.per_page))
      .then(users => reply(users))
      .catch(err => reply.error(err))
});
