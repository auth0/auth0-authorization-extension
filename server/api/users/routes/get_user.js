import Joi from 'joi';
import Boom from '@hapi/boom';

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
    try {
      const user = await req.pre.auth0.users.get({ id: req.params.id });
      return h.response(user);
    } catch (error) {
      // failing to get a user throws, so catch and return a 400
      throw Boom.badRequest();
    }
  }
});
