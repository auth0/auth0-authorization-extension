import Joi from 'joi';
import { getMappingsWithNames } from '../../../lib/queries';

export default (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/mappings',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the mappings for a group.',
    tags: [ 'api' ],
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    const group = await req.storage.getGroup(req.params.id);
    const mappings = group.mappings || [];
    const mappingsWithNames = await getMappingsWithNames(req.pre.auth0, mappings);
    return h.response(mappingsWithNames);
  }
});
