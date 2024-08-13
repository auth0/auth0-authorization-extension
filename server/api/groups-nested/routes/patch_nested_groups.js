import Joi from 'joi';

import schema from '../schemas/group_ids';

export default () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/nested',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add one or more nested groups in a group.',
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

    if (!group.nested) {
      group.nested = [];
    }

    nested.forEach(nestedGroupId => {
      if (group.nested.indexOf(nestedGroupId) === -1 && nestedGroupId !== req.params.id) {
        group.nested.push(nestedGroupId);
      }
    });

    await req.storage.updateGroup(req.params.id, group);

    return h.response().code(204);
  }
});
