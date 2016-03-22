import _ from 'lodash';
import Promise from 'bluebird';
import { Router } from 'express';

import { isApplicationAccessAllowed, getUserGroups, getDynamicUserGroups } from '../lib/queries';

export default (db) => {
  const api = Router();
  api.post('/:userId', (req, res, next) => {
    const { userId } = req.params;
    const { connectionId, clientId, groups } = req.body;

    Promise.all([ getUserGroups(db, userId), getDynamicUserGroups(db, connectionId, groups) ])
      .spread((userGroups, dynamicGroups) => _.union(userGroups, dynamicGroups))
      .then((userGroups) => isApplicationAccessAllowed(db, clientId, userGroups)
        .then(isAccessAllowed => res.json({ groups: userGroups, accessGranted: isAccessAllowed }))
      )
      .catch(next);
  });

  return api;
};
