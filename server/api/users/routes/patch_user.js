import Joi from 'joi';

import { updateUserId } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'PATCH',
  path: '/api/users/{id}/{newId}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Update user ID in the storage. In case of account linking, for instance',
    validate: {
      params: {
        id: Joi.string().required(),
        newId: Joi.string().required()
      }
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    updateUserId(req.storage, req.params.id, req.params.newId)
      .then(() => reply().code(204))
      .catch(err => reply.error(err))
});
