import { Router } from 'express';
import _ from 'lodash';
import uuid from 'node-uuid';

import auth0 from '../lib/auth0';
import { managementClient } from '../lib/middlewares';
import { validateGroup, validateGroupMapping } from '../lib/validate';
import { getMappingsWithNames, getChildGroups, getMembers } from '../lib/queries';

export default (db) => {
  const api = Router();

  /*
   * Get all members of a group.
   */
  api.get('/:id/members', managementClient, (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => auth0.getUsersById(group.members || [], {}, req.sub))
      .then(users => _.sortByOrder(users, [ 'last_login' ], [ false ]))
      .then(users => res.json(users))
      .catch(next);
  });

  /*
   * Get all nested members of a group.
   */
  api.get('/:id/members/nested', managementClient, (req, res, next) => {
    db.getGroups()
      .then((groups) => {
        const group = _.find(groups, { _id: req.params.id });
        const allGroups = getChildGroups(groups, [ group ]);
        return getMembers(allGroups);
      })
      .then(members => {
        return auth0.getUsersById(members.map(m => m.userId), {}, req.sub)
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
        );
      }
      )
      .then(nested => _.sortByOrder(nested, [ 'user.name' ], [ true ]))
      .then(nested => res.json(nested))
      .catch(next);
  });

  /*
   * Add one or more members to a group.
   */
  api.patch('/:id/members', (req, res, next) => {
    if (!Array.isArray(req.body)) {
      res.status(400);
      return res.json({
        code: 'invalid_request',
        message: 'The members must be an array.'
      });
    }

    return db.getGroup(req.params.id)
      .then(group => {
        const currentGroup = group;
        if (!currentGroup.members) {
          currentGroup.members = [];
        }

        // Add each member.
        req.body.forEach((member) => {
          if (currentGroup.members.indexOf(member) === -1) {
            currentGroup.members.push(member);
          }
        });

        return db.updateGroup(req.params.id, currentGroup);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  /*
   * Delete a member of a group.
   */
  api.delete('/:id/members', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => {
        const index = group.members.indexOf(req.body.userId);
        if (index > -1) {
          group.members.splice(index, 1);
        }

        return db.updateGroup(req.params.id, group);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });



  return api;
};
