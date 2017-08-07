import _ from 'lodash';
import { ValidationError } from 'auth0-extension-tools';

import schema from '../schemas/configuration';
import compileRule from '../../../lib/compileRule';

module.exports = (server) => ({
  method: 'PATCH',
  path: '/api/configuration',
  config: {
    auth: {
      strategies: [ 'jwt' ],
      scope: [ 'update:configuration' ]
    },
    pre: [
      server.handlers.managementClient
    ],
    validate: {
      options: {
        allowUnknown: false
      },
      payload: schema
    }
  },
  handler: (req, reply) => {
    const config = req.payload;

    if (config.groupsInIdToken || config.rolesInIdToken || config.permissionsInIdToken) {
      if (config.idTokenNamespace.indexOf('auth0.com') >= 0) {
        return reply.error(new ValidationError('ID Token Namespace cannot contain "auth0.com"'));
      }

      if (config.idTokenNamespace.indexOf('http') !== 0) {
        return reply.error(new ValidationError('ID Token Namespace should be a valid url'));
      }
    }

    if (config.groupsInAccessToken || config.rolesInAccessToken || config.permissionsInAccessToken) {
      if (config.accessTokenNamespace.indexOf('auth0.com') >= 0) {
        return reply.error(new ValidationError('Access Token Namespace cannot contain "auth0.com"'));
      }

      if (config.accessTokenNamespace.indexOf('http') !== 0) {
        return reply.error(new ValidationError('Access Token Namespace should be a valid url'));
      }
    }

    config.idTokenNamespace = config.idTokenNamespace.replace(/\/$/, '');
    config.accessTokenNamespace = config.accessTokenNamespace.replace(/\/$/, '');

    return req.pre.auth0.rules.getAll()
      .then(rules => {
        const userName = req.auth.credentials.email || 'unknown';
        const payload = {
          name: 'auth0-authorization-extension',
          script: compileRule(config, userName),
          enabled: true
        };

        const rule = _.find(rules, { name: payload.name });
        if (!rule) {
          return req.pre.auth0.rules.create({ stage: 'login_success', ...payload });
        }

        return req.pre.auth0.rules.update({ id: rule.id }, payload);
      })
      .then(() => req.storage.updateConfiguration(config))
      .then((updated) => reply(updated))
      .catch(err => reply.error(err));
  }
});
