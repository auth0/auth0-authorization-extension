import _ from 'lodash';
import Joi from 'joi';

import schema from '../schemas/policy_request';
import { getPermissionsForRoles, getRolesForGroups, getUserGroups } from '../../../lib/queries';

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
        return req.storage.getRoles()
          .then(allRoles => {
            const groupRoles = getRolesForGroups(userGroups, allRoles);
            const clearRoles = groupRoles.map(record => record.role);
            const directRoles = allRoles.filter(role => role.users && role.users.indexOf(userId) > -1);

            return [ ...clearRoles, ...directRoles ];
          });
      })
      .then(userRoles => {
        const relevantRoles = userRoles.filter(role => role.applicationId === clientId);
        result.roles = relevantRoles.map(role => role.name);

        return getPermissionsForRoles(req.storage, relevantRoles);
      })
      .then(permissions => ({ ...result, permissions: permissions.map(permission => permission.name) }))
      .then(data => reply({ groups: _.uniq(data.groups), permissions: _.uniq(data.permissions), roles: _.uniq(data.roles) }))
      .catch(err => reply.error(err));
  }
});
