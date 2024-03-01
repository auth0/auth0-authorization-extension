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
  handler: (req, reply) => {
    req.storage.deleteRole(req.params.id)
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
