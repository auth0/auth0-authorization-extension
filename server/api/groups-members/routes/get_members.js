import _ from 'lodash';
import Joi from 'joi';

import { getUsersById } from '../../../lib/users';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/members',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    description: 'Get the members for a group.',
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroup(req.params.id)
      .then(group => getUsersById(req.pre.auth0, group.members || [], {}))
      .then(users => _.sortByOrder(users, [ 'last_login' ], [ false ]))
      .then(users => reply(users))
      .catch(err => reply.error(err))
});
