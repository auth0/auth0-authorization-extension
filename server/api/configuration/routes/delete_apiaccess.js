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
  handler: (req, reply) => deleteApi(req)
    .then(() => reply().code(204))
    .catch(err => reply.error(err))
});
