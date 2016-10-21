import { urlHelpers } from 'auth0-extension-hapi-tools';
import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'GET',
  path: '/api/configuration/apiaccess',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    }
  },
  handler: (req, reply) => {
    const baseUrl = urlHelpers.getBaseUrl(req);
    const apiAccess = new ApiAccess(baseUrl);

    return req.storage.getApiAccess()
      .then(api => apiAccess.getApi(api && api.api_id))
      .then((api) => reply({ enabled: !!api, ...api }))
      .catch(err => reply.error(err.error || err));
  }
});
