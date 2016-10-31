import _ from 'lodash';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/configuration/status',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:configuration' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    req.pre.auth0.rules.getAll()
      .then(rules => {
        const rule = _.find(rules, { name: 'auth0-authorization-extension' });
        return {
          exists: !!rule,
          enabled: rule ? rule.enabled : false
        };
      })
      .then(rule => {
        req.storage.getStatus()
          .then(database => reply({ rule, database }))
          .catch(() => reply({ rule, database: { size: 0, type: 'unknown' } }));
      })
      .catch(err => reply.error(err))
});
