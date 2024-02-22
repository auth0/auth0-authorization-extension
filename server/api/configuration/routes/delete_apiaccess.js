import { deleteApi } from '../../../lib/apiaccess';

export default () => ({
  method: 'DELETE',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:resource-server' ]
    }
  },
  handler: async (req, h) => {
    await deleteApi(req);
    return h.response.code(204);
  }
});
