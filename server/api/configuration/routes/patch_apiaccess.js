import Joi from 'joi';
import { getApi, createApi, updateApi, deleteApi } from '../../../lib/apiaccess';

export default () => ({
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
  handler: (req, reply) => {
    if (!req.payload.apiAccess) {
      return deleteApi(req)
        .then(() => reply().code(204))
        .catch(err => reply.error(err));
    }

    return getApi(req)
      .then(resourceServer => {
        if (resourceServer) {
          return updateApi(req, req.payload.token_lifetime);
        }

        return createApi(req, req.payload.token_lifetime);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
