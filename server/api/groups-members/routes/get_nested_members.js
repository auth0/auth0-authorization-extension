import _ from 'lodash';
import Joi from 'joi';

import { getUsersById } from '../../../lib/users';
import { getChildGroups, getMembers } from '../../../lib/queries';

export default (server) => ({
  method: 'GET',
  path: '/api/groups/{id}/members/nested',
  options: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'read:groups' ]
    },
    description: 'Get the nested members for a group.',
    tags: [ 'api' ],
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      params: Joi.object({
        id: Joi.string().guid().required()
      }),
      query: Joi.object({
        per_page: Joi.number().integer().min(1).max(25).default(25), // eslint-disable-line newline-per-chained-call
        page: Joi.number().integer().min(0).default(0)
      })
    }
  },
  handler: (req, reply) =>
    req.storage.getGroups()
      .then((groups) => {
        const group = _.find(groups, { _id: req.params.id });
        const currentAndChildGroups = getChildGroups(groups, [ group ]);
        return getMembers(currentAndChildGroups);
      })
      .then(members => {
        const userIds = (members) ? members.map(member => member.userId) : [];

        return getUsersById(req.pre.auth0, userIds, req.query.page, req.query.per_page)
          .then(data => {
            const total = members.length;
            const users = data.users.map(u => {
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
            });

            return { total, nested: _.sortByOrder(users, [ 'user.name' ], [ true ]) };
          });
      })
      .then(users => reply(users))
      .catch(err => reply.error(err))
});
