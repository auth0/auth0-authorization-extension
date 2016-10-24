import _ from 'lodash';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/connections',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:connections' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    req.pre.auth0.connections.getAll({ fields: 'id,name,strategy' })
      .then(connections => _.chain(connections)
        .sortBy((conn) => conn.name.toLowerCase())
        .value())
      .then(connections => reply(connections))
      .catch(err => reply.error(err))
});
