import Joi from 'joi';

import schema from '../schemas/user_ids';

export default () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/members',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Delete one or more members from a group.',
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

    members.forEach(userId => {
      const index = group.members.indexOf(userId);
      if (index > -1) {
        group.members.splice(index, 1);
      }
    });

    await req.storage.updateGroup(req.params.id, group);

    return h.response.code(204);
  }
});
