import _ from 'lodash';
import Promise from 'bluebird';
import { Router } from 'express';

import { isApplicationAccessAllowed, getUserGroups, getDynamicUserGroups } from '../lib/queries';

export default (db) => {
  const api = Router();

  /*
   * Calculate the authorization context for a user.
   */
  api.post('/:userId', (req, res, next) => {
    const { userId } = req.params;
    const { connectionName, clientId, groups } = req.body;

    getUserGroups(db, userId, connectionName, groups)
      .then((userGroups) => isApplicationAccessAllowed(db, clientId, userGroups)
        .then(isAccessAllowed => res.json({ groups: userGroups, accessGranted: isAccessAllowed }))
      )
      .catch(next);
  });

  return api;
};
