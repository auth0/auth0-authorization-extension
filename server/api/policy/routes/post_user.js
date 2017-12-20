import Joi from 'joi';

import schema from '../schemas/policy_request';
import { getUserData } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'POST',
  path: '/api/users/{userId}/policy/{clientId}',
  config: {
    auth: {
      strategies: [
        'jwt',
        'extension-secret'
      ]
    },
    description: 'Execute the authorization policy for a user in the context of a client. This will return the user\'s groups but also roles and permissions that apply to the current client.',
    tags: [ 'api' ],
    validate: {
      params: {
        userId: Joi.string().required(),
        clientId: Joi.string().required()
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const { userId, clientId } = req.params;
    const { connectionName, groups } = req.payload;

    if (req.storage.provider && req.storage.provider.storageContext && req.storage.provider.storageContext.read) {
      return getUserData(req.storage, userId, clientId, connectionName, groups)
        .then(data => reply(data))
        .catch(err => reply.error(err));
    }

    return reply.error(new Error('Storage error.'));
  }
});
