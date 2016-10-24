import Joi from 'joi';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/roles/{id}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:roles' ]
    },
    description: 'Delete a role.',
    validate: {
      options: {
        allowUnknown: false
      },
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) => {
    req.storage.deleteRole(req.params.id)
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
