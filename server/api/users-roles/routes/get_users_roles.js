import Joi from 'joi';
import _ from 'lodash';

export default () => ({
  method: 'GET',
  path: '/api/users/{id}/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get the roles for a user.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    }
  },
  handler: async (req, h) => {
    const roles = await req.storage.getRoles();
    const rolesFiltered = _.filter(roles, (role) => _.includes(role.users, req.params.id));

    const rolesMapped = rolesFiltered.map((role) => ({
      _id: role._id,
      name: role.name,
      applicationId: role.applicationId,
      description: role.description
    }));

    console.log({ roles, rolesFiltered, rolesMapped, id: req.params.id });

    return h.response(rolesMapped);
  }
});
