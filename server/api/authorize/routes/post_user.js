import Joi from 'joi';

import schema from '../schemas/authorization_request';
import { getPermissionsForRoles, getRolesForUser, getUserGroups } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'POST',
  path: '/api/users/{userId}/calculate/{clientId}',
  config: {
    auth: {
      strategies: [
        'auth0-admins-jwt',
        'jwt',
        'extension-secret'
      ]
    },
    description: 'Get the authorization context for a user.',
    validate: {
      params: {
        userId: Joi.string().required(),
        clientId: Joi.string().required()
      },
      payload: schema
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    const { userId, clientId } = req.params;
    const { connectionName, groups } = req.payload;
    const result = {
      groups: [],
      roles: []
    };

    getUserGroups(req.storage, userId, connectionName, groups)
      .then(userGroups => {
        result.groups = userGroups.map(group => group.name);
        return getRolesForUser(req.storage, userId);
      })
      .then(userRoles => {
        const relevantRoles = userRoles.filter(role => role.applicationId === clientId);
        result.roles = relevantRoles.map(role => role.name);
        return getPermissionsForRoles(req.storage, relevantRoles);
      })
      .then(permissions => reply({ ...result, permissions: permissions.map(permission => permission.name) }))
      .catch(err => reply.error(err));
  }
});
