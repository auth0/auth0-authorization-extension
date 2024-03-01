import { getApi } from '../../../lib/apiaccess';

export default () => ({
  method: 'GET',
  path: '/api/configuration/resource-server',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:resource-server' ]
    }
  },
  handler: async (req, h) => {
    const api = await getApi(req);
    return h.response({ apiAccess: !!api.identifier, token_lifetime: api.token_lifetime });
  }
});
