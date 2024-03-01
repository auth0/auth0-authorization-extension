import Boom from '@hapi/boom';
import crypto from 'crypto';
import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';
// import * as tools from 'auth0-extension-hapi-tools';

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
        jwksRequestsPerMinute: 2,
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

    verify: (decoded, req) => {
      console.log({ fn: 'verify', stage: 1 });
      if (!decoded) {
        throw Boom.unauthorized('Invalid token', 'Token');
      }

      const header = req.headers.authorization;
      if (header && header.indexOf('Bearer ') === 0) {
        console.log({ fn: 'verify', stage: 2 });

        const token = header.split(' ')[1];
        if (decoded && decoded.payload && decoded.payload.iss === `https://${config('AUTH0_DOMAIN')}/`) {
          console.log({ fn: 'verify', stage: 3 });
          return jwtOptions.resourceServer.key(decoded, (keyErr, key) => {
            console.log({ fn: 'verify', stage: 4 });
            if (keyErr) {
              console.log({ fn: 'verify', stage: 5 });
              throw Boom.wrap(keyErr);
            }

            console.log({ fn: 'verify', stage: 6 });

            return jwt.verify(token, key, jwtOptions.resourceServer.verifyOptions, (err) => {
              if (err) {
                console.log({ fn: 'verify', stage: 7 });
                throw Boom.unauthorized('Invalid token', 'Token');
              }


              if (decoded.payload.gty && decoded.payload.gty !== 'client-credentials') {
                console.log({ fn: 'verify', stage: 8 });
                throw Boom.unauthorized('Invalid token', 'Token');
              }

              if (!decoded.payload.sub.endsWith('@clients')) {
                console.log({ fn: 'verify', stage: 9 });
                throw Boom.unauthorized('Invalid token', 'Token');
              }

              if (decoded.payload.scope && typeof decoded.payload.scope === 'string') {
                console.log({ fn: 'verify', stage: 10 });
                decoded.payload.scope = decoded.payload.scope.split(' '); // eslint-disable-line no-param-reassign
              }

              console.log({ fn: 'verify', stage: 11 });
              return decoded.payload;
            });
          });
        } else if (decoded && decoded.payload && decoded.payload.iss === config('PUBLIC_WT_URL')) {
          console.log({ fn: 'verify', stage: 12 });
          return jwt.verify(token, jwtOptions.dashboardAdmin.key, jwtOptions.dashboardAdmin.verifyOptions, (err) => {
            if (err) {
              console.log({ fn: 'verify', stage: 13 });
              throw Boom.unauthorized('Invalid token', 'Token');
            }

            if (!decoded.payload.access_token || !decoded.payload.access_token.length) {
              console.log({ fn: 'verify', stage: 14 });
              throw Boom.unauthorized('Invalid token', 'Token');
            }

            console.log({ fn: 'verify', stage: 15 });
            decoded.payload.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign

            console.log(JSON.stringify(decoded));
            return decoded.payload;
          });
        }
      }

      console.log({ fn: 'verify', stage: 16 });
      throw Boom.unauthorized('Invalid token', 'Token');
    }
  });
  server.auth.default('jwt');
  const session = {
    // plugin: tools.plugins.dashboardAdminSession.plugin,
    plugin,
    options: {
      stateKey: 'authz-state',
      nonceKey: 'authz-nonce',
      sessionStorageKey: 'authz:apiToken',
      rta: config('AUTH0_RTA').replace('https://', ''),
      domain: config('AUTH0_DOMAIN'),
      scopes: 'read:resource_servers create:resource_servers update:resource_servers delete:resource_servers read:clients read:connections read:rules create:rules update:rules update:rules_configs read:users',
      baseUrl: config('PUBLIC_WT_URL'),
      audience: 'urn:api-authz',
      secret: config('EXTENSION_SECRET'),
      clientName: 'Authorization Extension',
      onLoginSuccess: (decoded, req) => {
        console.log({ fn: 'onLoginSuccess', stage: 1 });
        if (decoded) {
          console.log({ fn: 'onLoginSuccess', stage: 2 });
          decoded.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return decoded;
        }

        console.log({ fn: 'onLoginSuccess', stage: 3 });
        throw Boom.unauthorized('Invalid token', 'Token');
      }
    }
  };
  server.register(session);

// (err) => {
//     if (err) {
//       next(err);
//     }

//     next();
//   }
};

// register.attributes = {
//   name: 'auth'
// };

export const authPlugin = {
  register,
  name: 'auth'
};
