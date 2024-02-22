import Joi from 'joi';

export default () => ({
  method: 'GET',
  path: '/api/roles/{id}',
  config: {
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
  handler: (req, reply) =>
    req.storage.getRole(req.params.id)
      .then(role => reply({
        _id: role._id,
        name: role.name,
        description: role.description
      }))
      .catch(err => reply.error(err))
});
