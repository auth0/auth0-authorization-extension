import _ from 'lodash';
import config from '../../../lib/config';
import { deleteApi } from '../../../lib/apiaccess';
import multipartRequest from '../../../lib/multipartRequest';

export default (server) => ({
  method: 'DELETE',
  path: '/.extensions/on-uninstall',
  config: {
    auth: false,
    pre: [
      server.handlers.validateHookToken('/.extensions/on-uninstall'),
      server.handlers.managementClient
    ]
  },
  handler: async (req, h) => {
    const rules = await multipartRequest(req.pre.auth0, 'rules', { fields: 'name,id' });

    const rule = _.find(rules, { name: 'auth0-authorization-extension' });
    if (rule) {
      await req.pre.auth0.rules.delete({ id: rule.id });
    }

    await deleteApi(req, true);
    await req.pre.auth0.clients.delete({ client_id: config('AUTH0_CLIENT_ID') });
    return h.response.code(204);
  }
});
