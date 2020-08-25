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
  handler: (req, reply) =>
    generateApiKey(req.storage, req.pre.auth0)
      .then((hash) => reply({ hash }))
      .catch(err => reply.error(err))
});
