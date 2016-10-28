import Joi from 'joi';
import _ from 'lodash';

import { getParentGroups } from '../../../lib/queries';

module.exports = () => ({
  method: 'GET',
  path: '/api/users/{id}/roles/groups',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:roles' ]
    },
    description: 'Get the roles of groups for a user.',
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then(groups => {
        // get all groups user belong to
        const userGroups = _.filter(groups, (group) => _.includes(group.members, req.params.id));
        return getParentGroups(groups, userGroups)
          .filter(group => group.roles && group.roles.length)
          .map(group => group.roles); // return roles for user's groups and their parents
      })
      .then(roles => _.uniq(_.flattenDeep(roles)))
      .then(roleIds =>
        req.storage.getRoles()
          .then(roles => _.filter(roles, role => _.includes(roleIds, role._id)))
      )
      .then(roles => reply(roles))
      .catch(err => reply.error(err))
});
