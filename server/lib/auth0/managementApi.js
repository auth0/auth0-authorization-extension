const jwt = require('jsonwebtoken');
const auth0 = require('auth0');
const memoizer = require('lru-memoizer');
const request = require('superagent');

const ArgumentError = require('../errors').ArgumentError;
const ManagementApiError = require('../errors').ManagementApiError;

const getAccessToken = function(domain, clientId, clientSecret) {
  return new Promise(function(resolve, reject) {
    request
      .post('https://' + domain + '/oauth/token')
      .send({
        audience: 'https://' + domain + '/api/v2/',
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      })
      .set('Accept', 'application/json')
      .end(function(err, res) {
        if (err && err.status === 401) {
          return reject(new ManagementApiError('unauthorized', 'Invalid credentials for ' + clientId, err.status));
        } else if (err && res && res.body && res.body.error) {
          return reject(new ManagementApiError(res.body.error, res.body.error_description || res.body.error, err.status));
        } else if (err) {
          return reject(err);
        }

        if (!res.ok || !res.body.access_token) {
          return reject(new ManagementApiError('unknown_error', 'Unknown error from Management Api or no access token was provided: ' + (res.text || res.status)));
        }

        return resolve(res.body.access_token);
      });
  });
};

const memoizedGetToken = memoizer({
  load: function(domain, clientId, clientSecret, callback) {
    getAccessToken(domain, clientId, clientSecret)
      .then(function(accessToken) {
        return callback(null, accessToken);
      })
      .catch(function(err) {
        return callback(err);
      });
  },
  hash: function(domain, clientId, clientSecret) {
    return domain + '-' + clientId + '-' + clientSecret;
  },
  itemMaxAge: function(domain, clientId, clientSecret, accessToken) {
    try {
      const decodedToken = jwt.decode(accessToken);
      const expiresIn = new Date(0);
      expiresIn.setUTCSeconds(decodedToken.exp);
      const now = new Date().valueOf();
      return (expiresIn.valueOf() - now) - 10000;
    } catch (e) {
      return 1000;
    }
  },
  max: 100,
  maxAge: 3600000 // 1 hour in milliseconds
});

// Promisify the memoizer using standard Promise
const getAccessTokenCached = function(domain, clientId, clientSecret) {
  return new Promise(function(resolve, reject) {
    memoizedGetToken(domain, clientId, clientSecret, function(err, token) {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });
};

const getClient = function(options) {
  if (options === null || options === undefined) {
    throw new ArgumentError('An options object must be provided');
  }

  if (options.domain === null || options.domain === undefined) {
    throw new ArgumentError('An options object must contain the domain');
  }

  if (typeof options.domain !== 'string' || options.domain.length === 0) {
    throw new ArgumentError('The provided domain is invalid: ' + options.domain);
  }

  if (options.accessToken) {
    if (typeof options.accessToken !== 'string' || options.accessToken.length === 0) {
      throw new ArgumentError('The provided accessToken is invalid');
    }

    const client = new auth0.ManagementClient({ domain: options.domain, token: options.accessToken, headers: options.headers });
    return Promise.resolve(client);
  }

  if (options.clientId === null || options.clientId === undefined) {
    throw new ArgumentError('An options object must contain the clientId');
  }

  if (typeof options.clientId !== 'string' || options.clientId.length === 0) {
    throw new ArgumentError('The provided clientId is invalid: ' + options.clientId);
  }

  if (options.clientSecret === null || options.clientSecret === undefined) {
    throw new ArgumentError('An options object must contain the clientSecret');
  }

  if (typeof options.clientSecret !== 'string' || options.clientSecret.length === 0) {
    throw new ArgumentError('The provided clientSecret is invalid');
  }

  return getAccessTokenCached(options.domain, options.clientId, options.clientSecret)
    .then(function(token) {
      const clientTwo = new auth0.ManagementClient({ domain: options.domain, token: token, headers: options.headers });
      return clientTwo;
    });
};

module.exports = {
  getAccessToken: getAccessToken,
  getAccessTokenCached: getAccessTokenCached,
  getClient: getClient
};
