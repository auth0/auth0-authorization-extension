import Joi from 'joi';

import schema from '../schemas/user_ids';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/groups/{id}/members',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add one or more members in a group.',
    tags: ['api'],
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
        if (!group.members) {
          group.members = [];
        }

        members.forEach(userId => {
          if (group.members.indexOf(userId) === -1) {
            group.members.push(userId);
          }
        });

        return req.storage.updateGroup(req.params.id, group);
      })
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
