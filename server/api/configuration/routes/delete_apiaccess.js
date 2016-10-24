import { deleteApi } from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:resource-server' ]
    }
  },
  handler: (req, reply) => deleteApi()
    .then(() => reply())
    .catch(err => reply.error(err))
});
