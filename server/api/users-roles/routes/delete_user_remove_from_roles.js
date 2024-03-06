import Promise from 'bluebird';
import Joi from 'joi';

export default () => ({
  method: 'DELETE',
  path: '/api/users/{id}/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:roles' ]
    },
    description: 'Remove a single user from roles.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.array().items(Joi.string().guid()).required().min(1)
    }
  },
  handler: async (req, h) => {
    const roleIds = req.payload;

    await Promise.each(roleIds, async (id) => {
      const role = await req.storage.getRole(id);

      if (!role.users) {
        role.users = []; // eslint-disable-line no-param-reassign
      }
      const index = role.users.indexOf(req.params.id);
      if (index > -1) {
        role.users.splice(index, 1);
      }

      await req.storage.updateRole(id, role);
    });

    return h.response(204);
  }
});
