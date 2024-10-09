import Joi from 'joi';
import { getApi, createApi, updateApi, deleteApi } from '../../../lib/apiaccess';

export default () => ({
  method: 'PATCH',
  path: '/api/configuration/resource-server',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:resource-server' ]
    },
    validate: {
      payload: Joi.object({
        apiAccess: Joi.boolean().required(),
        token_lifetime: Joi.number().integer()
      })
    }
  },
  handler: async (req, h) => {
    if (!req.payload.apiAccess) {
      await deleteApi(req);
      return h.response().code(204);
    }

    const resourceServer = await getApi(req);

    // update if exists, create otherwise
    if (resourceServer) {
      await updateApi(req, req.payload.token_lifetime);
    } else {
      await createApi(req, req.payload.token_lifetime);
    }

    return h.response().code(204);
  }
});
