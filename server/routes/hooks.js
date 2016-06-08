import _ from 'lodash';
import Promise from 'bluebird';
import { Router as router } from 'express';

import config from '../lib/config';
import logger from '../lib/logger';
import { validateHookToken } from '../lib/middlewares';
import managementApiClient from '../lib/ManagementApiClient';

export default () => {
  const hooks = router();
  hooks.use('/on-install', validateHookToken('/.extensions/on-install'));
  hooks.use('/on-uninstall', validateHookToken('/.extensions/on-uninstall'));
  hooks.delete('/on-uninstall', (req, res) => {
    managementApiClient.getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
      .then(auth0 =>
        auth0
          .rules.getAll()
          .then(rules => {
            const rule = _.find(rules, { name: 'auth0-authz' });
            if (rule) {
              return auth0.rules.delete({ id: rule.id });
            }

            return Promise.resolve();
          })
      )
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
