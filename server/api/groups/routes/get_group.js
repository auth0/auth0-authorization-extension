import Joi from 'joi';

module.exports = () => ({
  method: 'GET',
  path: '/api/groups/{id}',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get a single group based on its unique identifier.',
    tags: [ 'api' ],
    validate: {
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroup(req.params.id)
      .then(group => reply({ _id: group._id, name: group.name, description: group.description }))
      .catch(err => reply.error(err))
});
