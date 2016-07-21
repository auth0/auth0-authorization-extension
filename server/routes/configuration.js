import _ from 'lodash';
import { Router } from 'express';

import compileRule from '../lib/compileRule';
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
   * Update the settings.
   */
  configuration.patch('/', managementClient, (req, res, next) => {
    const config = req.body;

    req.auth0.rules.getAll()
      .then(rules => {
        const payload = {
          name: 'auth0-authz',
          script: compileRule(config),
          enabled: true
        };

        const rule = _.find(rules, { name: payload.name });
        if (!rule) {
          return req.auth0.rules.create({ stage: 'login_success', ...payload });
        }

        return req.auth0.rules.update({ id: rule.id }, payload);
      })
      .then(() => db.updateConfiguration(config))
      .then((updated) => res.json(updated))
      .catch(next);
  });

  /*
   * Get the status of the rule (exists and enabled)
   */
  configuration.get('/status', managementClient, (req, res, next) => {
    req.auth0.rules.getAll()
      .then(rules => {
        const rule = _.find(rules, { name: 'auth0-authorization-extension' });
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
