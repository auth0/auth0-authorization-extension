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
  handler: async (req, h) => {
    const nested = req.payload;

    const group = await req.storage.getGroup(req.params.id);

    nested.forEach(nestedGroupId => {
      const index = group.nested.indexOf(nestedGroupId);
      if (index > -1) {
        group.nested.splice(index, 1);
      }
    });

    await req.storage.updateGroup(req.params.id, group);

    return h.response().code(204);
  }
});
