import url from 'url';
import Boom from 'boom';
import jwt from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';

import { scopes } from '../lib/apiaccess';
import config from '../lib/config';

const getBaseUrl = (req) => {
  let protocol = 'https';
  const pathname = url
    .parse(req.originalUrl || '/')
    .pathname
    .replace(req.path, '');

  if ((process.env.NODE_ENV || 'development') === 'development') {
    protocol = req.connection.info.protocol;
  }

  return url.format({ protocol, host: req.headers.host, pathname }).replace(/\/+$/, '');
};

module.exports.register = (server, options, next) => {
  server.route({
    method: 'GET',
    path: '/admins/login',
    config: {
      auth: false
    },
    handler: (req, reply) => {
      const baseUrl = getBaseUrl(req);
      const redirectUri = `${baseUrl}/`;
      const audience = `https://${config('AUTH0_DOMAIN')}/api/v2/`;
      const scope = 'openid';
      const exp = 24 * 60 * 60 * 1000;

      reply.redirect(`https://auth0.auth0.com/i/oauth2/authorize?client_id=${baseUrl}&audience=${audience}&response_type=token&scope=${scope}&expiration=${exp}&redirect_uri=${redirectUri}`);
    }
  });

  server.route({
    method: 'GET',
    path: '/.well-known/oauth2-client-configuration',
    config: {
      auth: false
    },
    handler: (req, reply) => {
      let protocol = 'https';
      const pathname = url
        .parse(req.originalUrl || '/')
        .pathname
        .replace(req.path, '');

      if ((process.env.NODE_ENV || 'development') === 'development') {
        protocol = req.connection.info.protocol;
        //   opt.clientId = opt.clientId || 'N3PAwyqXomhNu6IWivtsa3drBfFjmWJL';
      }

      const baseUrl = url.format({
        protocol,
        host: req.headers.host,
        pathname
      });

      reply({
        redirect_uris: [ `${baseUrl.replace(/\/+$/, '')}/` ],
        client_name: 'Auth0 Authorization Dashboard Extension',
        post_logout_redirect_uris: [ baseUrl ]
      });
    }
  });

  server.register(jwt, (err) => {
    if (err) {
      next(err);
    }

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
        jwksUri: 'https://auth0.auth0.com/.well-known/jwks.json'
      }),

      // On tokens where the authorized party is the current extension.
      validateFunc: (decoded, req, callback) => {
        const baseUrl = getBaseUrl(req);
        if (decoded && decoded.azp === baseUrl) {
          decoded.scope = scopes.map(scope => scope.value); // eslint-disable-line no-param-reassign
          return callback(null, true, decoded);
        }

        return callback(null, false);
      },

      // Validate the audience and the issuer.
      verifyOptions: {
        audience: `https://${config('AUTH0_DOMAIN')}/api/v2/`,
        issuer: 'https://auth0.auth0.com/',
        algorithms: [ 'RS256' ]
      }
    });
    server.auth.default('jwt');
  });

  next();
};

module.exports.register.attributes = {
  name: 'auth'
};
