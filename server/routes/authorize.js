import _ from 'lodash';
import Promise from 'bluebird';
import { Router } from 'express';
import { managementClient } from '../lib/middlewares';

import { isApplicationAccessAllowed, getUserGroups, getDynamicUserGroups } from '../lib/queries';

export default (db) => {
  const api = Router();
  api.post('/:userId', managementClient, (req, res, next) => {
    const { userId } = req.params;
    const { connectionName, clientId, groups } = req.body;

    Promise.all([ getUserGroups(db, userId), getDynamicUserGroups(req.auth0, db, connectionName, groups) ])
      .spread((userGroups, dynamicGroups) => _.union(userGroups, dynamicGroups))
      .then((userGroups) => isApplicationAccessAllowed(db, clientId, userGroups)
        .then(isAccessAllowed => res.json({ groups: userGroups, accessGranted: isAccessAllowed }))
      )
      .catch(next);
  });

  return api;
};
