import _ from 'lodash';

import schema from '../schemas/configuration';
import compileRule from '../../../lib/compileRule';
import multipartRequest from '../../../lib/multipartRequest';

export default (server) => ({
  method: 'PATCH',
  path: '/api/configuration',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:configuration' ]
    },
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: async (req, h) => {
    const config = req.payload;

    const script = await compileRule(req.storage, req.pre.auth0, config, req.auth.credentials.email || 'unknown');
    const rules = await multipartRequest(req.pre.auth0, 'rules', { fields: 'name,id' });

    const payload = {
      name: 'auth0-authorization-extension',
      enabled: true,
      script
    };

    const rule = _.find(rules, { name: payload.name });
    if (!rule) {
      await req.pre.auth0.rules.create({ stage: 'login_success', ...payload });
    } else {
      await req.pre.auth0.rules.update({ id: rule.id }, payload);
    }

    const updated = await req.storage.updateConfiguration(config);
    return h.response(updated);
  }
});
