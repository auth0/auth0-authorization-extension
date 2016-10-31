import { createApi } from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'POST',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'create:resource-server' ]
    }
  },
  handler: (req, reply) => createApi()
    .then(api => reply(api))
    .catch(err => reply.error(err))
});
