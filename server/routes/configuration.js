import _ from 'lodash';
import { Router } from 'express';
import { managementClient } from '../lib/middlewares';

export default (db) => {
  const configuration = Router();

  /*
   * Get the current settings.
   */
  configuration.get('/', managementClient, (req, res, next) =>
    db.getConfiguration()
      .then(config => res.json(config || { }))
      .catch(next)
  );

  /*
   * Get the status of the rule (exists and enabled)
   */
  configuration.get('/status', managementClient, (req, res, next) => {
    req.auth0.rules.getAll()
      .then(rules => {
        const rule = _.find(rules, { name: 'auth0-authz' });
        res.json({
          rule: {
            exists: !!rule,
            enabled: rule ? rule.enabled : false
          }
        });
      })
      .catch(next);
  });

  return configuration;
};
