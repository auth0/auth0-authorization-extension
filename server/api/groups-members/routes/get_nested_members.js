import _ from 'lodash';
import Joi from 'joi';

import { getUsersById } from '../../../lib/users';
import { getChildGroups, getMembers } from '../../../lib/queries';

module.exports = (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/members/nested',
  config: {
    auth: false,
    description: 'Get the nested members for a group.',
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: {
        id: Joi.string().guid().required()
      }
    }
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then((groups) => {
        const group = _.find(groups, { _id: req.params.id });
        const currentAndChildGroups = getChildGroups(groups, [ group ]);
        return getMembers(currentAndChildGroups);
      })
      .then(members =>
        getUsersById(req.pre.auth0, members.map(m => m.userId), {})
          .then(users => users.map(u => {
            let userGroup = _.find(members, { userId: u.user_id });
            if (userGroup) {
              userGroup = { _id: userGroup.group._id, name: userGroup.group.name, description: userGroup.group.description };
            }

            return {
              user: {
                user_id: u.user_id,
                name: u.name,
                nickname: u.nickname,
                email: u.email
              },
              group: userGroup
            };
          })
        )
      )
      .then(nested => _.sortByOrder(nested, [ 'user.name' ], [ true ]))
      .then(users => reply(users))
      .catch(err => reply.error(err))
});
