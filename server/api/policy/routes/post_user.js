import Joi from 'joi';
import Boom from '@hapi/boom';

import schema from '../schemas/policy_request';
import { getUserData } from '../../../lib/queries';

export default () => ({
  method: 'POST',
  path: '/api/users/{userId}/policy/{clientId}',
  options: {
    auth: {
      strategies: [ 'jwt', 'extension-secret' ]
    },
    description:
      "Execute the authorization policy for a user in the context of a client. This will return the user's groups but also roles and permissions that apply to the current client.",
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        userId: Joi.string().required(),
        clientId: Joi.string().required()
      }),
      payload: schema
    }
  },
  handler: async (req, h) => {
    const { userId, clientId } = req.params;
    const { connectionName, groups } = req.payload;

    if (
      req.storage.provider &&
      req.storage.provider.storageContext &&
      req.storage.provider.storageContext.read
    ) {
      const data = await getUserData(req.storage, userId, clientId, connectionName, groups);
      return h.response(data);
    }

    // if we can't read from storage
    throw Boom.badRequest('Storage error');
  }
});
