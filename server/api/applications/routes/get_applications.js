import _ from 'lodash';
import multipartRequest from '../../../lib/multipartRequest';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/applications',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:applications' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    multipartRequest(req.pre.auth0, 'clients', { global: false, fields: 'client_id,name,callbacks,app_type' })
      .then(clients => _.chain(clients)
        .filter(client => client.app_type === 'spa' || client.app_type === 'native' || client.app_type === 'regular_web')
        .sortBy((client) => client.name.toLowerCase())
        .value())
      .then(applications => reply(applications))
      .catch(err => reply.error(err))
});
