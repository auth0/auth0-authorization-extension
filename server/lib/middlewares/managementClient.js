import nconf from 'nconf';
import memoizer from 'lru-memoizer';
import { getDb } from '../storage/getdb';

let auth0 = require('auth0');
if (nconf.get('HOSTING_ENV') === 'webtask') {
  auth0 = require('auth0@2.0.0');
}

let managementClient;

// Static client when using a static key.
if (nconf.get('AUTH0_APIV2_TOKEN')) {
  managementClient = new auth0.ManagementClient({
    token: nconf.get('AUTH0_APIV2_TOKEN'),
    domain: nconf.get('AUTH0_DOMAIN')
  });
}

// Cache tokens.
export const getToken = memoizer({
  load: (sub, callback) => {
    getDb().getToken(sub)
      .then((token) => {
        callback(null, token.accessToken);
      })
      .catch(callback);
  },
  hash: (sub) => sub,
  max: 100,
  maxAge: nconf.get('DATA_CACHE_MAX_AGE')
});


module.exports = function managementClientMiddleware(req, res, next) {
  // Use the static client.
  if (managementClient) {
    req.auth0 = managementClient;
    return next();
  }

  // Use the dynamic client based on the current user token.
  return getToken((err, token) => {
    if (err) {
      return next(err);
    }

    req.auth0 = new auth0.ManagementClient({
      token: token,
      domain: nconf.get('AUTH0_DOMAIN')
    });
    return next();
  });
};
