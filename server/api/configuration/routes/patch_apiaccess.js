import Joi from 'joi';
import { urlHelpers } from 'auth0-extension-hapi-tools';
import ApiAccess from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/configuration/apiaccess',
  config: {
    auth: {
      strategies: [
        'jwt'
      ]
    },
    validate: {
      payload: {
        lifetime: Joi.number().integer().required()
      }
    }
  },
  handler: (req, reply) => {
    const baseUrl = urlHelpers.getBaseUrl(req);
    const apiAccess = new ApiAccess(baseUrl);
    const lifetime = req.payload.lifetime;

    return req.storage.getApiAccess()
      .then(api => apiAccess.updateApi(api && api.api_id, lifetime))
      .then(() => reply())
      .catch(err => reply.error(err.error || err));
  }
});
