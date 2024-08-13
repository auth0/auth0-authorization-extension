import Joi from 'joi';

export default (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/roles',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the roles for a group.',
    tags: [ 'api' ],
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    const group = await req.storage.getGroup(req.params.id);
    const roleIds = group.roles || [];
    const roles = await req.storage.getRoles();
    const filteredRoles = roles.filter(role => roleIds.indexOf(role._id) > -1); // eslint-disable-line no-underscore-dangle

    return h.response(filteredRoles);
  }
});
