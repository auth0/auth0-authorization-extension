import Joi from 'joi';
import { updateApi } from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'update:resource-server' ]
    },
    validate: {
      payload: {
        apiAccess: Joi.boolean().required(),
        token_lifetime: Joi.number().integer()
      }
    }
  },
  handler: (req, reply) => updateApi(req.payload.token_lifetime)
    .then(() => reply().code(204))
    .catch(err => reply.error(err))
});
