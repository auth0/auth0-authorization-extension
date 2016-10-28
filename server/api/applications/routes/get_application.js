import Joi from 'joi';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/applications/{clientId}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:applications' ]
    },
    description: 'Get a single application based on its Client ID.',
    validate: {
      params: {
        clientId: Joi.string().required()
      }
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    req.pre.auth0.clients.get({ client_id: req.params.clientId })
      .then(client => reply(client))
      .catch(err => reply.error(err))
});
