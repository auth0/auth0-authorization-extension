import Boom from 'boom';
import jwksRsa from 'jwks-rsa';
import * as tools from 'auth0-extension-hapi-tools';

import config from '../lib/config';
import { scopes } from '../lib/apiaccess';

module.exports.register = (server, options, next) => {
  server.auth.scheme('extension-secret', () =>
    ({
      authenticate: (request, reply) => {
        const apiKey = request.headers['x-api-key'];
        if (apiKey && apiKey === config('AUTHORIZE_API_KEY')) {
          return reply.continue({
            credentials: {
              user: 'rule'
            }
          });
        }
        return reply(Boom.unauthorized('Invalid API Key'));
      }
    })
  );
  server.auth.strategy('extension-secret', 'extension-secret');

  server.auth.strategy('jwt', 'jwt', {
    // Get the complete decoded token, because we need info from the header (the kid)
    complete: true,

    // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
    key: jwksRsa.hapiJwt2Key({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri: `https://${config('AUTH0_DOMAIN')}/.well-known/jwks.json`
    }),

    validateFunc: (decoded, req, callback) => {
      if (decoded) {
        return callback(null, true, decoded);
      }

      return callback(null, false);
    },

    // Validate the audience and the issuer.
    verifyOptions: {
      audience: 'urn:auth0-authz-api',
      issuer: 'https://auth0.auth0.com/',
      algorithms: [ 'RS256' ]
    }
  });
  server.auth.default('jwt');

  const session = {
    register: tools.plugins.dashboardAdminSession,
    options: {
      sessionStorageKey: 'authz:apiToken',
      rta: config('AUTH0_RTA'),
      domain: config('AUTH0_DOMAIN'),
      scopes: 'create:resource_servers read:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules read:users update:users read:device_credentials read:logs',
      baseUrl: config('WT_URL'),
      audience: 'urn:api-authz',
      secret: config('EXTENSION_SECRET'),
      clientName: 'Authorization Extension',
      onLoginSuccess: (decoded, req, callback) => {
        if (decoded) {
          decoded.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return callback(null, true, decoded);
        }

        return callback(null, false);
      }
    }
  };
  server.register(session, (err) => {
    if (err) {
      next(err);
    }

    next();
  });
};

module.exports.register.attributes = {
  name: 'auth'
};
