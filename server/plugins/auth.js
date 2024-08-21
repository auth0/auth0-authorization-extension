import Boom from '@hapi/boom';
import crypto from 'crypto';
import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { Promise } from 'bluebird';

import config from '../lib/config';
import { scopes } from '../lib/apiaccess';
import { plugin } from './session';


const hashApiKey = (key) => crypto.createHmac('sha256', `${key} + ${config('AUTH0_CLIENT_SECRET')}`)
  .update(config('EXTENSION_SECRET'))
  .digest('hex');

const register = async (server) => {
  server.auth.scheme('extension-secret', () =>
    ({
      authenticate: (request, h) => {
        const apiKey = request.headers['x-api-key'];
        return request.storage.getApiKey()
          .then(key => {
            if (apiKey && apiKey === hashApiKey(key)) {
              return h.authenticated({
                credentials: {
                  user: 'rule'
                }
              });
            }

            throw Boom.unauthorized('Invalid API Key');
          });
      }
    })
  );
  server.auth.strategy('extension-secret', 'extension-secret');

  const jwtOptions = {
    dashboardAdmin: {
      key: config('EXTENSION_SECRET'),
      verifyOptions: {
        audience: 'urn:api-authz',
        issuer: config('PUBLIC_WT_URL'),
        algorithms: [ 'HS256' ]
      }
    },
    resourceServer: {
      key: jwksRsa.hapiJwt2Key({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: process.env.NODE_ENV === 'test' ? 10 : 2,
        jwksUri: `https://${config('AUTH0_DOMAIN')}/.well-known/jwks.json`
      }),
      verifyOptions: {
        audience: 'urn:auth0-authz-api',
        issuer: `https://${config('AUTH0_DOMAIN')}/`,
        algorithms: [ 'RS256' ]
      }
    }
  };

  server.auth.strategy('jwt', 'jwt', {
    // Get the complete decoded token, because we need info from the header (the kid)
    complete: true,

    verify: async (decoded, req) => {
      try {
        if (!decoded) {
          throw Boom.unauthorized('Invalid token', 'Token');
        }

        const header = req.headers.authorization;
        if (!header || !header.indexOf('Bearer ') === 0) {
          throw Boom.unauthorized('Invalid token', 'Token');
        }

        const token = header.split(' ')[1];

        const isApiRequest = decoded && decoded.payload && decoded.payload.iss === `https://${config('AUTH0_DOMAIN')}/`;
        const isDashboardAdminRequest = decoded && decoded.payload && decoded.payload.iss === config('PUBLIC_WT_URL');

        const getKeyAsync = Promise.promisify(jwtOptions.resourceServer.key);
        const jwtVerifyAsync = Promise.promisify(jwt.verify);

        if (isApiRequest) {
          if (decoded.payload.gty && decoded.payload.gty !== 'client-credentials') {
            throw Boom.unauthorized('Invalid token', 'Token');
          }

          if (!decoded.payload.sub.endsWith('@clients')) {
            throw Boom.unauthorized('Invalid token', 'Token');
          }

          const resourceServerKey = await getKeyAsync(decoded);

          if (!resourceServerKey) {
            throw Boom.unauthorized('Invalid token', 'Token');
          }

          // this can throw if there is an error
          await jwtVerifyAsync(token, resourceServerKey, jwtOptions.resourceServer.verifyOptions);


          if (decoded.payload.scope && typeof decoded.payload.scope === 'string') {
            decoded.payload.scope = decoded.payload.scope.split(' '); // eslint-disable-line no-param-reassign
          }

          return { credentials: decoded.payload, isValid: true };
        }

        if (isDashboardAdminRequest) {
          if (!decoded.payload.access_token || !decoded.payload.access_token.length) {
            throw Boom.unauthorized('Invalid token', 'Token');
          }

          // this can throw if there is an error
          await jwtVerifyAsync(token, jwtOptions.dashboardAdmin.key, jwtOptions.dashboardAdmin.verifyOptions);

          decoded.payload.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return { credentials: decoded.payload, isValid: true };
        }
      } catch (error) {
        throw Boom.unauthorized('Invalid token', 'Token');
      }
    }
  });
  server.auth.default('jwt');
  const session = {
    plugin,
    options: {
      stateKey: 'authz-state',
      nonceKey: 'authz-nonce',
      sessionStorageKey: 'authz:apiToken',
      rta: config('AUTH0_RTA').replace('https://', ''),
      domain: config('AUTH0_DOMAIN'),
      // scopes: 'read:resource_servers create:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules update:rules_configs read:users',
      scopes: 'read:resource_servers create:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules update:rules_configs read:users read:configuration',
      baseUrl: config('PUBLIC_WT_URL'),
      audience: 'urn:api-authz',
      secret: config('EXTENSION_SECRET'),
      clientName: 'Authorization Extension',
      onLoginSuccess: (decoded, req) => {
        if (decoded) {
          decoded.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return decoded;
        }

        throw Boom.unauthorized('Invalid token', 'Token');
      }
    }
  };
  server.register(session);
};

export const authPlugin = {
  register,
  name: 'auth'
};
