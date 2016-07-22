import Joi from 'joi';
import _ from 'lodash';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/groups',
  config: {
    auth: false,
    description: 'Get the groups for a user.',
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then(groups => _.filter(groups, (group) => _.includes(group.members, req.params.id)))
      .then(groups => groups.map((group) => ({
        _id: group._id,
        name: group.name,
        description: group.description
      })))
      .then(groups => reply(groups))
      .catch(err => reply.error(err))
});
