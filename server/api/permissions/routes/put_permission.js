import Joi from 'joi';
import schema from '../schemas/permission';

export default () => ({
  method: 'PUT',
  path: '/api/permissions/{id}',
  config: {
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
      params: {
        id: Joi.string().guid().required()
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const permission = req.payload;
    return req.storage.updatePermission(req.params.id, permission)
      .then((updated) => reply(updated))
      .catch(err => reply.error(err));
  }
});
