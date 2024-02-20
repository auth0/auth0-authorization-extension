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
  handler: (req, h) => deleteApi(req)
    .then(() => h.response.code(204))
    .catch(err => { throw new Error(err); })
});
