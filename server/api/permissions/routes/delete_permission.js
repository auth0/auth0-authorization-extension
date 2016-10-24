import Joi from 'joi';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/permissions/{id}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'delete:permissions' ]
    },
    description: 'Delete a permission.',
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
    req.storage.deletePermission(req.params.id)
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
