import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/roles/{id}',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get a single role based on its unique identifier.',
    tags: [ 'api' ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      })
    }
  },
  handler: async (req, h) => {
    const role = await req.storage.getRole(req.params.id);

    return h.response({
      _id: role._id,
      name: role.name,
      description: role.description
    });
  }
});
