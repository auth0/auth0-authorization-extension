import Joi from 'joi';

import schema from '../schemas/authorization_request';
import { isApplicationAccessAllowed, getUserGroups } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/authorize/{userId}',
  config: {
    auth: {
      strategies: [
        'jwt',
        'extension-secret'
      ]
    },
    description: 'Get the authorization context for a user.',
    validate: {
      params: {
        userId: Joi.string().required()
      },
      payload: schema
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    const { userId } = req.params;
    const { connectionName, clientId, groups } = req.payload;

    getUserGroups(req.storage, userId, connectionName, groups)
      .then((userGroups) => isApplicationAccessAllowed(req.storage, clientId, userGroups)
        .then(isAccessAllowed => reply({
          groups: userGroups.map((group) => group.name),
          accessGranted: isAccessAllowed
        }))
      )
      .catch(err => reply.error(err));
  }
});
