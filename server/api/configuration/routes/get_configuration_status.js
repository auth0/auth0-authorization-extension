import _ from 'lodash';
import multipartRequest from '../../../lib/multipartRequest';

export default (server) => ({
  method: 'GET',
  path: '/api/configuration/status',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:configuration' ]
    },
    pre: [
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) =>
      multipartRequest(req.pre.auth0, 'rules', { fields: 'name,enabled' })
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
