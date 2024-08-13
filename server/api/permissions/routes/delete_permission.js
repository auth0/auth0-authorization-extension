import Joi from 'joi';

export default () => ({
  method: 'DELETE',
  path: '/api/permissions/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:permissions' ]
    },
    description: 'Delete a permission.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    await req.storage.deletePermission(req.params.id);
    return h.response().code(204);
  }
});
