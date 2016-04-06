import async from 'async';
import nconf from 'nconf';
import moment from 'moment';
import Promise from 'bluebird';
import request from 'request';
import memoizer from 'lru-memoizer';
import { getDb } from './storage/getdb';


export const getTokenCached = memoizer({
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

export const getToken = (sub, cb) => {
  const token = nconf.get('AUTH0_APIV2_TOKEN');
  if (token) {
    return cb(null, token);
  }

  return getTokenCached(sub, cb);
};

class Auth0ApiClient {
  constructor() {
    this.accessToken = null;
    this.accessTokenIssued = null;
  }

  getLogs(options, sub) {
    options = options || {};
    options.search = '';

    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        request.get({
          json: true,
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/logs`,
          qs: options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }, (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  getLog(logId, sub) {
    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        request.get({
          json: true,
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/logs/${logId}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }, (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  getUserLogs(userId, options, sub) {
    options = options || {};
    options.page = 0;
    options.per_page = 20;

    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        request.get({
          json: true,
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${userId}/logs`,
          qs: options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }, (error, response, body) => {
          if (error || response.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  deleteUserMultiFactor(userId, provider, sub) {
    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        const req = {
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(userId)}/multifactor/${provider}`,
          json: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        request.del(req, (error, res, body) => {
          if (error || res.statusCode !== 204) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  getUsers(options, sub) {
    options = options || {};
    options.page = options.page || 0;
    options.per_page = options.per_page || 200;

    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        const req = {
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users`,
          qs: options,
          json: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        request.get(req, (error, res, body) => {
          if (error || res.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  getUser(userId, options, sub) {
    options = options || {};

    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        const req = {
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${userId}`,
          qs: options,
          json: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        request.get(req, (error, res, body) => {
          if (error || res.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  getUsersById(users, options, sub) {
    return new Promise((resolve, reject) => {
      const userRecords = [];

      async.eachLimit(users, 10, (userId, cb) => {
        this.getUser(userId, options, sub)
          .then((user) => {
            userRecords.push(user);
            cb();
          })
          .catch(cb);
      }, (err) => {
        if (err) {
          return reject(err);
        }

        return resolve(userRecords);
      });
    });
  }

  getClients(options, sub) {
    options = options || {};

    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        const req = {
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/clients`,
          qs: options,
          json: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        request.get(req, (error, res, body) => {
          if (error || res.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  getDevices(userId, options, sub) {
    options = options || {};

    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        const req = {
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/device-credentials`,
          qs: {
            user_id: userId,
            ...options
          },
          json: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        request.get(req, (error, res, body) => {
          if (error || res.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }

  patchUser(userId, body, sub) {
    return new Promise((resolve, reject) => {
      getToken(sub, (err, token) => {
        if (err) {
          return reject(err);
        }

        const req = {
          url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(userId)}`,
          body: body,
          json: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        request.patch(req, (error, res, body) => {
          if (error || res.statusCode !== 200) {
            return reject(body);
          }

          resolve(body);
        });
      });
    });
  }
}

export default new Auth0ApiClient();
