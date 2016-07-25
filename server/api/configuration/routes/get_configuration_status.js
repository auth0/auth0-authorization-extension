import _ from 'lodash';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/configuration/status',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
    req.pre.auth0.rules.getAll()
      .then(rules => {
        const rule = _.find(rules, { name: 'auth0-authorization-extension' });
        reply({
          rule: {
            exists: !!rule,
            enabled: rule ? rule.enabled : false
          }
        });
      })
      .catch(err => reply.error(err))
});
