import _ from 'lodash';
import multipartRequest from '../../../lib/multipartRequest';

export default (server) => ({
  method: 'GET',
  path: '/api/applications',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:applications' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: async (req, h) => {
    const clients = await multipartRequest(req.pre.auth0, 'clients', { is_global: false, fields: 'client_id,name,callbacks,app_type' });

    const applications = _.chain(clients)
        .filter(client => client.app_type === 'spa' || client.app_type === 'native' || client.app_type === 'regular_web')
        .sortBy((client) => client.name.toLowerCase())
        .value();

    return h.response(applications);
  }
});
