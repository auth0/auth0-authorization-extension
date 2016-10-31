import Boom from 'boom';
import jwt from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';

import config from '../lib/config';

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

  next();
};

module.exports.register.attributes = {
  name: 'auth'
};
