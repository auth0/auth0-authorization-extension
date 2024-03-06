import Joi from 'joi';

import schema from '../schemas/user_ids';

export default () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/members',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add one or more members in a group.',
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
    const members = req.payload;

    const group = await req.storage.getGroup(req.params.id);

    if (!group.members) {
      group.members = [];
    }

    members.forEach(userId => {
      if (group.members.indexOf(userId) === -1) {
        group.members.push(userId);
      }
    });

    await req.storage.updateGroup(req.params.id, group);

    return h.response.code(204);
  }
});
