import Joi from 'joi';

import { removeUserId } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'DELETE',
  path: '/api/users/{id}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Remove user ID from the storage.',
    validate: {
      params: {
        id: Joi.string().required()
      }
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    removeUserId(req.storage, req.params.id)
      .then(() => reply().code(204))
      .catch(err => reply.error(err))
});
