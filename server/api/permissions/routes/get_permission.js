import Joi from 'joi';

module.exports = () => ({
  method: 'GET',
  path: '/api/permissions/{id}',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:permissions' ]
    },
    description: 'Get a single permission based on its unique identifier.',
    validate: {
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getPermission(req.params.id)
      .then(permission => reply({
        _id: permission._id,
        name: permission.name,
        description: permission.description
      }))
      .catch(err => reply.error(err))
});
