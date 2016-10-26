import Joi from 'joi';
import { updateApi } from '../../../lib/apiaccess';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/configuration/resource-server',
  config: {
    auth: {
      strategies: [ 'jwt' ],
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
    .then(() => reply())
    .catch(err => reply.error(err))
});
