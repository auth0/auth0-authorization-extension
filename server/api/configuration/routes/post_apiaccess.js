import { createApi } from '../../../lib/apiaccess';

export default () => ({
  method: 'POST',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'create:resource-server' ]
    }
  },
  handler: async (req, h) => {
    const api = await createApi(req);
    return h.response(api);
  }
});
