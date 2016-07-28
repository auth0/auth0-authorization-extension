import _ from 'lodash';
import Promise from 'bluebird';
import { Router as router } from 'express';

import logger from '../lib/logger';
import { managementClient, validateHookToken } from '../lib/middlewares';

export default () => {
  const hooks = router();
  hooks.use('/on-install', validateHookToken('/.extensions/on-install'));
  hooks.use('/on-uninstall', validateHookToken('/.extensions/on-uninstall'));
  hooks.delete('/on-uninstall', managementClient, (req, res) => {
    req.auth0
      .rules.getAll()
      .then(rules => {
        const rule = _.find(rules, { name: 'auth0-authz' });
        if (rule) {
          return req.auth0.rules.delete({ id: rule.id });
        }

        return Promise.resolve();
      })
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.error(err);
        res.sendStatus(500);
      });
  });
  return hooks;
};
