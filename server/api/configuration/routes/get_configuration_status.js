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
  handler: async (req, h) => {
    const rules = await multipartRequest(req.pre.auth0, 'rules', { fields: 'name,enabled' });
    const ruleRecord = _.find(rules, { name: 'auth0-authorization-extension' });
    const rule = {
      exists: !!ruleRecord,
      enabled: ruleRecord ? ruleRecord.enabled : false
    };
    try {
      const database = req.storage.getStatus();
      return h.response({ rule, database });
    } catch (dbError) {
      return h.response({ rule, database: { size: 0, type: 'unknown' } });
    }
  }
});
