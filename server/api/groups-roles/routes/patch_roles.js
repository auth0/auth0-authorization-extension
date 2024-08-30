import Joi from 'joi';

export default () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add one or more roles to a group.',
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
    const roles = req.payload;

    const group = await req.storage.getGroup(req.params.id);

    if (!group.roles) {
      group.roles = [];
    }

    const rolesToAdd = group.roles
      ? roles.filter(roleId => !group.roles.includes(roleId))
      : roles;

    await req.storage.updateGroup(req.params.id, { ...group, roles: rolesToAdd });

    return h.response().code(204);
  }
});
