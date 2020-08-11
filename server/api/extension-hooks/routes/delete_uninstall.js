import _ from 'lodash';
import config from '../../../lib/config';
import { deleteApi } from '../../../lib/apiaccess';
import multipartRequest from '../../../lib/multipartRequest';

module.exports = (server) => ({
  method: 'DELETE',
  path: '/.extensions/on-uninstall',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/.extensions/on-uninstall'),
      server.handlers.managementClient
    ]
  },
  handler: (req, reply) => {
    multipartRequest(req.pre.auth0, 'rules', { fields: 'name,id' })
      .then(rules => {
        const rule = _.find(rules, { name: 'auth0-authorization-extension' });
        if (rule) {
          return req.pre.auth0.rules.delete({ id: rule.id });
        }

        return Promise.resolve();
      })
      .then(() => deleteApi(req, true))
      .then(() => req.pre.auth0.clients.delete({ client_id: config('AUTH0_CLIENT_ID') }))
      .then(() => reply().code(204))
      .catch((err) => reply.error(err));
  }
});
