import { urlHelpers } from 'auth0-extension-hapi-tools';
import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'POST',
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

    return apiAccess.createApi()
      .then(api => req.storage.createApiAccess(api)
        .then(() => reply(api)))
      .catch(err => reply.error(err.error || err));
  }
});
