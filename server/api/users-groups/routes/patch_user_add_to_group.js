import Promise from 'bluebird';
import Joi from 'joi';

module.exports = (server) => ({
  method: 'PATCH',
  path: '/api/users/{id}/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:groups' ]
    },
    description: 'Add a single user to groups.',
    validate: {
      params: {
        id: Joi.string().required()
      },
      payload: Joi.array().items(Joi.string().guid()).required().min(1)
    }
  },
  handler: (req, reply) => {
    const groupIds = req.payload;
    const recursiveUpdate = () => {
      if (groupIds.length) {
        const currentId = groupIds.pop();

        return req.storage.getGroup(currentId)
          .then(group => {
            if (!group.members) {
              group.members = [];
            }
            if (group.members.indexOf(req.params.id) === -1) {
              group.members.push(req.params.id);
            }

            return req.storage.updateGroup(currentId, group)
              .then(recursiveUpdate)
              .catch(err => reply.error(err));
          });
      }

      return reply().code(204);
    };

    recursiveUpdate();
  }
});
