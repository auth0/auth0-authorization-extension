import Joi from 'joi';
import schema from '../schemas/permission';

export default () => ({
  method: 'PUT',
  path: '/api/permissions/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:permissions' ]
    },
    description: 'Update a permission.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      payload: schema
    }
  },
  handler: async (req, h) => {
    const permission = req.payload;
    const updated = await req.storage.updatePermission(req.params.id, permission);

    return h.response(updated);
  }
});
