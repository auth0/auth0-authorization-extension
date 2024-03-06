import Joi from 'joi';

export default () => ({
  method: 'DELETE',
  path: '/api/groups/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:groups' ]
    },
    description: 'Delete a group.',
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
    await req.storage.deleteGroup(req.params.id);
    return h.response.code(204);
  }
});
