import _ from 'lodash';
import Promise from 'bluebird';
import Joi from 'joi';

export default () => ({
  method: 'PATCH',
  path: '/api/users/{id}/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:roles' ]
    },
    description: 'Add a single user to roles.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      }),
      payload: Joi.array().items(Joi.string()).required().min(1)
    }
  },
  handler: async (req, h) => {
    const roleIds = req.payload;
    const pattern = /^(\{{0,1}([0-9a-fA-F]){8}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){4}-?([0-9a-fA-F]){12}\}{0,1})$/;
    const searchBy = pattern.test(roleIds[0]) ? '_id' : 'name';

    const roles = await req.storage.getRoles();
    const rolesFiltered = _.filter(roles, (role) => _.includes(roleIds, role[searchBy]));


    await Promise.each(rolesFiltered, async (role) => {
      if (!role.users) {
        role.users = []; // eslint-disable-line no-param-reassign
      }
      if (role.users.indexOf(req.params.id) === -1) {
        role.users.push(req.params.id);
      }

      await req.storage.updateRole(role._id, role);
    });

    return h.response().code(204);
  }
});
