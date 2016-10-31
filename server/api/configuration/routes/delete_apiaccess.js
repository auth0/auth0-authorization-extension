import { deleteApi } from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'delete:resource-server' ]
    }
  },
  handler: (req, reply) => deleteApi()
    .then(() => reply().code(204))
    .catch(err => reply.error(err))
});
