import { urlHelpers } from 'auth0-extension-hapi-tools';
import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'DELETE',
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
      .then(api => apiAccess.deleteApi(api && api.api_id))
      .then(() => req.storage.deleteApiAccess())
      .then(() => reply())
      .catch(err => reply.error(err.error || err));
  }
});
