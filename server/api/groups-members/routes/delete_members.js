import Joi from 'joi';

import schema from '../schemas/user_ids';

module.exports = () => ({
  method: 'DELETE',
  path: '/api/groups/{id}/members',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Delete one or more members from a group.',
    tags: [ 'api' ],
    validate: {
      options: {
        allowUnknown: false
      },
      params: {
        id: Joi.string().guid().required()
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const members = req.payload;

    req.storage.getGroup(req.params.id)
      .then(group => {
        members.forEach(userId => {
          const index = group.members.indexOf(userId);
          if (index > -1) {
            group.members.splice(index, 1);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
