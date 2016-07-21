import _ from 'lodash';
import Boom from 'boom';

import logger from '../../lib/logger';

module.exports = (server) => ({
  method: 'DELETE',
  path: '/.extensions/on-uninstall',
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
      .then(rules => {
        let rule = _.find(rules, { name: 'auth0-authz' });
        if (rule) {
          return req.auth0.rules.delete({ id: rule.id });
        }

        rule = _.find(rules, { name: 'auth0-authorization-extension' });
        if (rule) {
          return req.auth0.rules.delete({ id: rule.id });
        }

        return Promise.resolve();
      })
      .then(() => reply().code(204))
      .catch((err) => {
        logger.error(err);
        reply(Boom.wrap(err));
      });
  }
});
