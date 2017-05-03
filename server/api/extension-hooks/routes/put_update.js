import _ from 'lodash';
import { compileAuthorizeRule, compileRestrictAccessRule } from '../../../lib/compileRule';

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
    var availableRules;
    req.pre.auth0
      .rules
      .getAll()
      .then(rules => {
        const config = {
          groupsInToken: true,
          persistGroups: true
        };

        const payload = {
          name: 'auth0-authorization-extension',
          script: compileAuthorizeRule(config, 'auth0-authz-extension')
        };

        availableRules = rules;

        const rule = _.find(rules, { name: 'auth0-authz' });
        if (rule) {
          return req.pre.auth0.rules.update({ id: rule.id }, payload);
        }

        return Promise.resolve();
      })
      .then(() => {
        const payload = {
          name: 'auth0-authorization-restrict-access',
          script: compileRestrictAccessRule('auth0-authz-extension')
        };

        const rule = _.find(availableRules, { name: 'auth0-authorization-restrict-access' });
        if (rule) {
          return req.pre.auth0.rules.update({ id: rule.id }, payload);
        } else {
          return req.pre.auth0.rules.create( {stage: 'login_success', ...payload});
        }
      })
      .then(() => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
