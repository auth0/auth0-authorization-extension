import Joi from 'joi';
import _ from 'lodash';

import { getParentGroups } from '../../../lib/queries';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/groups/calculate',
  config: {
    auth: {
      strategies: [ 'auth0-admins-jwt', 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the groups for a user.',
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then(groups => getParentGroups(groups, _.filter(groups, (group) => _.includes(group.members, req.params.id))))
      .then(groups => groups.map((group) => ({
        _id: group._id,
        name: group.name,
        description: group.description
      })))
      .then(groups => reply(groups))
      .catch(err => reply.error(err))
});
