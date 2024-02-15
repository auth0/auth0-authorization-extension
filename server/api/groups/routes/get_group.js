import Joi from 'joi';

import { getGroupExpanded } from '../../../lib/queries';

export default () => ({
  method: 'GET',
  path: '/api/groups/{id}',
  config: {
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
  handler: (req, reply) => {
    if (req.query.expand) {
      return getGroupExpanded(req.storage, req.params.id)
        .then(group => reply(group))
        .catch(err => reply.error(err));
    }

    return req.storage.getGroup(req.params.id)
      .then(group => reply({ _id: group._id, name: group.name, description: group.description }))
      .catch(err => reply.error(err));
  }
});
