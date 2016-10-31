import Promise from 'bluebird';
import Joi from 'joi';

module.exports = () => ({
  method: 'PATCH',
  path: '/api/users/{id}/groups',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
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

    return Promise.mapSeries(groupIds, id => req.storage.getGroup(id)
      .then(group => {
        if (!group.members) {
          group.members = []; // eslint-disable-line no-param-reassign
        }
        if (group.members.indexOf(req.params.id) === -1) {
          group.members.push(req.params.id);
        }

        return req.storage.updateGroup(id, group);
      }))
      .then(() => reply().code(204))
      .catch(err => reply.error(err));
  }
});
