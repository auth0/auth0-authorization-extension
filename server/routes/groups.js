import { Router } from 'express';
import _ from 'lodash';
import uuid from 'node-uuid';
import validator from 'validate.js';

import auth0 from '../lib/auth0';

const validateGroup = (group) => validator(group, {
  name: {
    presence: true,
    length: {
      minimum: 3,
      tooShort: 'Please enter a name with at least 3 characters.'
    }
  }
});

const validateGroupMapping = (groupMapping) => validator(groupMapping, {
  connectionId: {
    presence: true
  },
  groupName: {
    presence: true,
    length: {
      minimum: 3,
      tooShort: 'Please enter a group name with at least 3 characters.'
    }
  }
});

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

  api.get('/:id', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => res.json({ _id: group._id, name: group.name, description: group.description }))
      .catch(next);
  });

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

  api.delete('/:id', (req, res, next) => {
    db.deleteGroup(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.get('/:id/mappings', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => res.json(group.mappings || []))
      .catch(next);
  });

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
        const { _id, groupName, connectionId } = req.body;
        currentGroup.mappings.push({
          _id: _id || uuid.v4(),
          groupName,
          connectionId
        });

        // Save the group.
        return db.updateGroup(req.params.id, currentGroup);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  api.get('/:id/members', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(group => auth0.getUsersById(group.members || []))
      .then(users => _.orderBy(users, [ 'last_login' ], [ 'desc' ]))
      .then(users => res.json(users))
      .catch(next);
  });

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
