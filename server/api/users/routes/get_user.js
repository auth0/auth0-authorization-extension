import Joi from 'joi';

export default (server) => ({
  method: 'GET',
  path: '/api/users/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:users' ]
    },
    description: 'Get a single user based on its unique identifier.',
    validate: {
      params: Joi.object({
        id: Joi.string().required()
      })
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: async (req, h) => {
    const user = await req.pre.auth0.users.get({ id: req.params.id });
    return h.response(user);
  }
});
