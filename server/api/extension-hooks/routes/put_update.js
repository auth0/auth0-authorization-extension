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
    let allRules;
    req.pre.auth0
      .rules
      .getAll()
      .then(rules => { // remove old rule if exists
        allRules = rules;
        const rule = _.find(rules, { name: 'auth0-authz' });
        if (rule) {
          return req.pre.auth0.rules.delete({ id: rule.id });
        }

        return Promise.resolve();
      })
      .then(() => req.storage.getConfiguration())
      .then((config) => { // create new rule
        const payload = {
          name: 'auth0-authorization-extension',
          script: compileRule(config, 'auth0-authz-extension'),
          enabled: true
        };

        const rule = _.find(allRules, { name: payload.name });
        if (!rule) {
          return req.pre.auth0.rules.create({ stage: 'login_success', ...payload });
        }

        return req.pre.auth0.rules.update({ id: rule.id }, payload);
      })
      .then(() => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
