import generateApiKey from '../../../lib/generateApiKey';

export default (server) => ({
  method: 'PATCH',
  path: '/api/configuration/rotate-apikey',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:configuration' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: async (req, h) => {
    const hash = await generateApiKey(req.storage, req.pre.auth0);
    return h.response({ hash });
  }
});
