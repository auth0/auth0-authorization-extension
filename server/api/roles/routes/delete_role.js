import Joi from 'joi';

export default () => ({
  method: 'DELETE',
  path: '/api/roles/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:roles' ]
    },
    description: 'Delete a role.',
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
    await req.storage.deleteRole(req.params.id);

    return h.response.code(204);
  }
});
