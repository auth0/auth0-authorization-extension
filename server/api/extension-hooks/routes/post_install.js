import _ from 'lodash';
import { compileAuthorizeRule, compileRestrictAccessRule } from '../../../lib/compileRule';

module.exports = (server) => ({
  method: 'POST',
  path: '/.extensions/on-install',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/.extensions/on-install'),
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    req.pre.auth0
      .rules
      .getAll()
      .then(rules => {
        const payload = {
          name: 'auth0-authorization-restrict-access',
          script: compileRestrictAccessRule('auth0-authz-extension')
        };

        const rule = _.find(rules, { name: 'auth0-authorization-restrict-access' });
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
