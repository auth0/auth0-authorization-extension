import { Router } from 'express';
import _ from 'lodash';
import uuid from 'node-uuid';

import auth0 from '../lib/auth0';
import { managementClient } from '../lib/middlewares';
import { validateGroup, validateGroupMapping } from '../lib/validate';
import { getMappingsWithNames, getChildGroups, getMembers } from '../lib/queries';

export default (db) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    db.getGroups()
      .then(groups => groups.map(group => {
        const currentGroup = group;
        currentGroup.mappings = currentGroup.mappings || [];
        currentGroup.members = currentGroup.members || [];
        return currentGroup;
      }))
      .then(groups => res.json(groups))
      .catch(next);
  });

  /*
   * Get a group.
   */
  api.get('/:id', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => res.json({ _id: group._id, name: group.name, description: group.description }))
      .catch(next);
  });

  /*
   * Create a group.
   */
  api.post('/', (req, res, next) => {
    const errors = validateGroup(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    const group = req.body;
    return db.createGroup(group)
      .then((created) => res.json(created))
      .catch(next);
  });

  /*
   * Update a group.
   */
  api.put('/:id', (req, res, next) => {
    const errors = validateGroup(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    const group = req.body;
    return db.updateGroup(req.params.id, group)
      .then((updated) => res.json(updated))
      .catch(next);
  });

  /*
   * Delete a group.
   */
  api.delete('/:id', (req, res, next) => {
    db.deleteGroup(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Get the mappings for a group.
   */
  api.get('/:id/mappings', managementClient, (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => group.mappings || [])
      .then(mappings => getMappingsWithNames(req.auth0, mappings))
      .then(mappings => res.json(mappings))
      .catch(next);
  });

  /*
   * Create a group mapping.
   */
  api.post('/:id/mappings', (req, res, next) => {
    const errors = validateGroupMapping(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    return db.getGroup(req.params.id)
      .then(group => {
        const currentGroup = group;
        if (!currentGroup.mappings) {
          currentGroup.mappings = [];
        }

        // Add the new mapping.
        const { _id, groupName, connectionName } = req.body;
        currentGroup.mappings.push({
          _id: _id || uuid.v4(),
          groupName,
          connectionName
        });

        // Save the group.
        return db.updateGroup(req.params.id, currentGroup);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  /*
   * Delete a group mapping.
   */
  api.delete('/:id/mappings', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => {
        const groupMapping = _.find(group.mappings, { _id: req.body.groupMappingId });
        if (groupMapping) {
          group.mappings.splice(group.mappings.indexOf(groupMapping), 1);
        }

        return db.updateGroup(req.params.id, group);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  /*
   * Get all members of a group.
   */
  api.get('/:id/members', managementClient, (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => auth0.getUsersById(group.members || [], {}, req.sub))
      .then(users => _.orderBy(users, [ 'last_login' ], [ 'desc' ]))
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
      .then(nested => _.orderBy(nested, [ 'user.name' ], [ 'asc' ]))
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

  /*
   * Get all nested groups of a group.
   */
  api.get('/:id/nested', (req, res, next) => {
    db.getGroups()
      .then((groups) => {
        const group = _.find(groups, { _id: req.params.id });
        if (!group.nested) {
          group.nested = [];
        }
        return _.filter(groups, g => group.nested.indexOf(g._id) > -1);
      })
      .then(nested => _.orderBy(nested, [ 'name' ], [ 'asc' ]))
      .then(nested => res.json(nested))
      .catch(next);
  });

  /*
   * Add one or more nested groups to a group.
   */
  api.patch('/:id/nested', (req, res, next) => {
    if (!Array.isArray(req.body)) {
      res.status(400);
      return res.json({
        code: 'invalid_request',
        message: 'The nested groups must be an array.'
      });
    }

    return db.getGroup(req.params.id)
      .then(group => {
        const currentGroup = group;
        if (!currentGroup.nested) {
          currentGroup.nested = [];
        }

        // Add each nested group.
        req.body.forEach((nestedGroup) => {
          if (currentGroup.nested.indexOf(nestedGroup) === -1 && nestedGroup !== req.params.id) {
            currentGroup.nested.push(nestedGroup);
          }
        });

        return db.updateGroup(req.params.id, currentGroup);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  /*
   * Remove a nested group from a group.
   */
  api.delete('/:id/nested', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => {
        const index = group.nested.indexOf(req.body.groupId);
        if (index > -1) {
          group.nested.splice(index, 1);
        }

        return db.updateGroup(req.params.id, group);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  return api;
};
