import _ from 'lodash';
import apiCall from '../../../lib/apiCall';

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
    apiCall(req.pre.auth0, req.pre.auth0.clients.getAll, [ { fields: 'client_id,name,callbacks,global,app_type' } ])
      .then(clients => _.chain(clients)
        .filter(client =>
          !client.global &&
          (client.app_type === 'spa' || client.app_type === 'native' || client.app_type === 'regular_web')
        )
        .sortBy((client) => client.name.toLowerCase())
        .value())
      .then(applications => reply(applications))
      .catch(err => reply.error(err))
});
