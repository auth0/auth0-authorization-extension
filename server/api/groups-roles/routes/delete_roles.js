import Joi from 'joi';

export default () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Delete one or more roles from a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      payload: Joi.array().items(Joi.string().guid()).required().min(1)
    }
  },
  handler: async (req, h) => {
    const members = req.payload;

    const group = await req.storage.getGroup(req.params.id);

    members.forEach(userId => {
      const index = group.roles.indexOf(userId);
      if (index > -1) {
        group.roles.splice(index, 1);
      }
    });

    await req.storage.updateGroup(req.params.id, group);

    return h.response().code(204);
  }
});
