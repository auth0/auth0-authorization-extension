import Joi from 'joi';
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
    const apiAccess = new ApiAccess();
    const lifetime = req.payload.lifetime;

    return apiAccess.updateApi(lifetime)
      .then(() => reply())
      .catch(err => reply.error(err));
  }
});
