import Joi from 'joi';
import { getMappingsWithNames } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/mappings',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the mappings for a group.',
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
      .then(group => group.mappings || [])
      .then(mappings => getMappingsWithNames(req.pre.auth0, mappings))
      .then(mappings => reply(mappings))
      .catch(err => reply.error(err))
});
