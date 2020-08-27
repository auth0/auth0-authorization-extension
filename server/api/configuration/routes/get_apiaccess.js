import { getApi } from '../../../lib/apiaccess';

export default () => ({
  method: 'GET',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:resource-server' ]
    }
  },
  handler: (req, reply) => getApi(req)
    .then((api) => reply({ apiAccess: !!api.identifier, token_lifetime: api.token_lifetime }))
    .catch(err => reply.error(err))
});
