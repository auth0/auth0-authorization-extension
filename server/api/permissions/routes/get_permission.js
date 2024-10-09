import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/permissions/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:permissions' ]
    },
    description: 'Get a single permission based on its unique identifier.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    const permission = await req.storage.getPermission(req.params.id);
    return h.response({
      _id: permission._id,
      name: permission.name,
      description: permission.description
    });
  }
});
