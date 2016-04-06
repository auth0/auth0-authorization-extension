import _ from 'lodash';
import nconf from 'nconf';
import logger from './logger';
import { getDb } from './storage/getdb';
import authorizeRule from '../rules/authorize';

let auth0 = require('auth0');
if (nconf.get('HOSTING_ENV') === 'webtask') {
  auth0 = require('auth0@2.0.0');
}

const createRule = (ruleVersion, db, managementClient) => {
  try {
    logger.info(`Creating rule ${ruleVersion}`);

    managementClient.rules.create({
      name: 'auth0-groups',
      enabled: true,
      script: authorizeRule(nconf.get('WT_URL'), nconf.get('AUTHORIZE_API_KEY'))
    })
    .then(() => db.createRule({ version: ruleVersion }))
    .catch((err) => {
      logger.error(err);
    });
  } catch (e) {
    logger.error(e);
  }
};

export default (token) => {
  const db = getDb();
  const ruleVersion = '1.0';
  const managementClient = new auth0.ManagementClient({
    token,
    domain: nconf.get('AUTH0_DOMAIN')
  });

  // Create the rule if it doesn't exist yet.
  db.getRules()
    .then((data) => {
      const rule = _.find(data, { version: ruleVersion });
      if (rule) {
        return rule;
      }

      return createRule(ruleVersion, db, managementClient);
    })
    .catch((err) => {
      logger.error(err);

      createRule(ruleVersion, db, managementClient);
    });
};
