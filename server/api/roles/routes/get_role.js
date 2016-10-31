import Joi from 'joi';

module.exports = () => ({
  method: 'GET',
  path: '/api/roles/{id}',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get a single role based on its unique identifier.',
    validate: {
      params: {
        id: Joi.string().guid().required()
      }
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
