import Joi from 'joi';
import _ from 'lodash';

import { getGroupsExpanded } from '../../../lib/queries';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the groups for a user. Add "?expand" to also load all roles and permissions for these groups.',
    tags: [ 'api' ],
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  handler: (req, reply) => {
    if (req.query.expand) {
      return req.storage.getGroups()
        .then(groups => _.filter(groups, (group) => _.includes(group.members, req.params.id)))
        .then(groups => getGroupsExpanded(req.storage, groups))
        .then(groups => reply(groups))
        .catch(err => reply.error(err));
    }

    return req.storage.getGroups()
      .then(groups => _.filter(groups, (group) => _.includes(group.members, req.params.id)))
      .then(groups => groups.map((group) => ({
        _id: group._id,
        name: group.name,
        description: group.description
      })))
      .then(groups => reply(groups))
      .catch(err => reply.error(err));
  }

});
