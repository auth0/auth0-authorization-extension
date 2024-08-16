import Joi from 'joi';
import Boom from '@hapi/boom';

import { getGroupExpanded } from '../../../lib/queries';

export default () => ({
  method: 'GET',
  path: '/api/groups/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get a single group based on its unique identifier. Add "?expand" to also load all roles and permissions for this group.',
    tags: [ 'api' ],
    validate: {
      query: Joi.object({
        expand: Joi.boolean()
      }),
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    try {
      if (req.query.expand) {
        const groupExpanded = await getGroupExpanded(req.storage, req.params.id);
        return h.response(groupExpanded);
      }

      const group = await req.storage.getGroup(req.params.id);
      return h.response({ _id: group._id, name: group.name, description: group.description });
    } catch (error) {
      throw Boom.badRequest(`The record ${req.params.id} in groups does not exist.`);
    }
  }
});
