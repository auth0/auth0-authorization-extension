import _ from 'lodash';
import Joi from 'joi';

import { getChildGroups, getRolesForGroups } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/roles/nested',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the nested roles for a group.',
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
    req.storage.getGroups()
      .then(groups => {
        const group = _.find(groups, { _id: req.params.id });
        return getChildGroups(groups, [ group ]);
      })
      .then(groups => req.storage.getRoles()
        .then(roles => getRolesForGroups(groups, roles))
      )
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
