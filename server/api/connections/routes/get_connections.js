import _ from 'lodash';
import multipartRequest from '../../../lib/multipartRequest';

export default (server) => ({
  method: 'GET',
  path: '/api/connections',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:connections' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: async (req, h) => {
    const connections = await multipartRequest(req.pre.auth0, 'connections', { fields: 'id,name,strategy' });

    const sortedConnections = _.chain(connections)
      .sortBy((conn) => conn.name.toLowerCase())
      .value();

    return h.response(sortedConnections);
  }
});
