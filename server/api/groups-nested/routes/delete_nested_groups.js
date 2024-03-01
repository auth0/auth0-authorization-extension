import Joi from 'joi';

import schema from '../schemas/group_ids';

export default () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/nested',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Delete one or more nested groups from a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      payload: schema
    }
  },
  handler: (req, reply) => {
    const nested = req.payload;

    req.storage.getGroup(req.params.id)
      .then(group => {
        nested.forEach(nestedGroupId => {
          const index = group.nested.indexOf(nestedGroupId);
          if (index > -1) {
            group.nested.splice(index, 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
