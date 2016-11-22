import Joi from 'joi';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/roles',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Delete one or more roles from a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: {
        id: Joi.string().guid().required()
      },
      payload: Joi.array().items(Joi.string().guid()).required().min(1)
    }
  },
  handler: (req, reply) => {
    const members = req.payload;

    req.storage.getGroup(req.params.id)
      .then(group => {
        members.forEach(userId => {
          const index = group.roles.indexOf(userId);
          if (index > -1) {
            group.roles.splice(index, 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
