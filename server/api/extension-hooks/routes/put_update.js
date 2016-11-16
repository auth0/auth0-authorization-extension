import _ from 'lodash';
import compileRule from '../../../lib/compileRule';

module.exports = (server) => ({
  method: 'PUT',
  path: '/.extensions/on-update',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/meta'),
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    req.pre.auth0
      .rules
      .getAll()
      .then(rules => req.storage.getConfiguration()
        .then((config) => {
          const payload = {
            name: 'auth0-authorization-extension',
            script: compileRule(config, 'auth0-authz-extension')
          };

          const rule = _.find(rules, { name: 'auth0-authz' });
          if (rule) {
            return req.pre.auth0.rules.update({ id: rule.id }, payload);
          }

          return Promise.resolve();
        }))
      .then(() => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
