import _ from 'lodash';
import compileRule from '../../../lib/compileRule';

module.exports = (server) => ({
  method: 'PUT',
  path: '/.extensions/on-update',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/.extensions/on-update'),
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    req.pre.auth0
      .rules
      .getAll()
      .then(rules => {
        const name = 'auth0-authorization-extension';
        const rule = _.find(rules, { name });

        if (rule) {
          return compileRule(req.storage, req.pre.auth0, name)
            .then(script => req.pre.auth0.rules.update({ id: rule.id }, { name, script }));
        }

        return Promise.resolve();
      })
      .then(() => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
