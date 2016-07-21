import _ from 'lodash';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/applications',
  config: {
    auth: false,
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    req.pre.auth0.clients.getAll({ fields: 'client_id,name,callbacks,global' })
      .then(clients => _.chain(clients)
        .filter({ global: false })
        .sortBy((client) => client.name.toLowerCase())
        .value())
      .then(applications => reply(applications))
      .catch(err => reply.error(err))
});
