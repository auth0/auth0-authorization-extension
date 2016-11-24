import Joi from 'joi';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/groups/{id}',
  config: {
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
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) => {
    req.storage.deleteGroup(req.params.id)
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
