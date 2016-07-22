import url from 'url';
import Boom from 'boom';
import jwt from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';

import config from '../lib/config';

module.exports.register = (server, options, next) => {
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
        redirect_uris: [ `${baseUrl.replace(/\/+$/, '')}/callback` ],
        client_name: 'Authorization Extension',
        post_logout_redirect_uris: [ baseUrl ]
      });
    }
  });

  server.register(jwt, (err) => {
    if (err) {
      next(err);
    }

    server.auth.scheme('extension-secret', () => {
      return {
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
      };
    });

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

      // Your own logic to validate the user.
      validateFunc: (decoded, request, callback) => {
        console.log('Validating user:', decoded);

        if (decoded && decoded.sub) {
          return callback(null, true);
        }

        return callback(null, false);
      },

      // Validate the audience and the issuer.
      verifyOptions: {
        audience: `https://${config('AUTH0_DOMAIN')}/api/v2/`,
        issuer: `https://${config('AUTH0_DOMAIN')}/`,
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
