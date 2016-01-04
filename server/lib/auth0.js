import nconf from 'nconf';
import moment from 'moment';
import request from 'request';

class Auth0ApiClient {
  constructor() {
    this.accessToken = null;
    this.accessTokenIssued = null;
  }

  getAccessToken() {
    return new Promise((resolve, reject) => {
      if (this.accessTokenIssued) {
        const timeAgo = moment(new Date()).diff(this.accessTokenIssued, 'minutes');
        if (timeAgo < 60) {
          return resolve(this.accessToken);
        }
      }

      const body = {
        'client_id': nconf.get('AUTH0_CLIENT_ID'),
        'client_secret': nconf.get('AUTH0_CLIENT_SECRET'),
        'grant_type': 'client_credentials'
      };

      request.post({ url: `https://${nconf.get('AUTH0_DOMAIN')}/oauth/token`, form: body }, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode === 404) {
          return reject(new Error(`The client_id '${nconf.get('AUTH0_CLIENT_ID')}' is not known in '${nconf.get('AUTH0_DOMAIN')}'`));
        }

        if (resp.statusCode.toString().substr(0, 1) !== '2') {
          return reject(new Error('Unknown error from Auth0: ' + resp.statusCode));
        }

        this.accessToken = JSON.parse(body)['access_token'];
        this.accessTokenIssued = new Date();
        return resolve(this.accessToken);
      });
    });
  }

  getLogs(options) {
    options = options || {};
    options.search = '';

    return this.getAccessToken()
      .then(token => {
        return new Promise((resolve, reject) => {
          request.get({
            json: true,
            url: `https://${nconf.get('AUTH0_DOMAIN')}/api/logs`,
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

  getLog(logId) {
    return this.getAccessToken()
      .then(token => {
        return new Promise((resolve, reject) => {
          request.get({
            json: true,
            url: `https://${nconf.get('AUTH0_DOMAIN')}/api/logs/${logId}`,
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

  deleteUserMultiFactor(userId, provider) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(userId)}/multifactor/${provider}`,
        json: true,
        headers: {
          'Authorization': `Bearer ${nconf.get('AUTH0_APIV2_TOKEN')}`
        }
      };

      request.del(req, (error, res, body) => {
        if (error || res.statusCode !== 204) {
          return reject(body);
        }

        resolve(body);
      });
    });
  }

  getUsers(options) {
    options = options || {};
    options.page = options.page || 0;
    options.per_page = options.per_page || 200;

    return new Promise((resolve, reject) => {
      const req = {
        url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users`,
        qs: options,
        json: true,
        headers: {
          'Authorization': `Bearer ${nconf.get('AUTH0_APIV2_TOKEN')}`
        }
      };

      request.get(req, (error, res, body) => {
        if (error || res.statusCode !== 200) {
          return reject(body);
        }

        resolve(body);
      });
    });
  }

  getUser(userId, options) {
    options = options || {};

    return new Promise((resolve, reject) => {
      const req = {
        url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${userId}`,
        qs: options,
        json: true,
        headers: {
          'Authorization': `Bearer ${nconf.get('AUTH0_APIV2_TOKEN')}`
        }
      };

      request.get(req, (error, res, body) => {
        if (error || res.statusCode !== 200) {
          return reject(body);
        }

        resolve(body);
      });
    });
  }

  getClients(options) {
    options = options || {};

    return new Promise((resolve, reject) => {
      const req = {
        url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/clients`,
        qs: options,
        json: true,
        headers: {
          'Authorization': `Bearer ${nconf.get('AUTH0_APIV2_TOKEN')}`
        }
      };

      request.get(req, (error, res, body) => {
        if (error || res.statusCode !== 200) {
          return reject(body);
        }

        resolve(body);
      });
    });
  }

  getDevices(userId, options) {
    options = options || {};

    return new Promise((resolve, reject) => {
      const req = {
        url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/device-credentials`,
        qs: {
          user_id: userId,
          ...options
        },
        json: true,
        headers: {
          'Authorization': `Bearer ${nconf.get('AUTH0_APIV2_TOKEN')}`
        }
      };

      request.get(req, (error, res, body) => {
        if (error || res.statusCode !== 200) {
          return reject(body);
        }

        resolve(body);
      });
    });
  }

  getUserLogs(userId, options) {
    options = options || {};
    options.page = 0;
    options.per_page = 20;

    return this.getAccessToken()
      .then(token => {
        return new Promise((resolve, reject) => {
          request.get({
            json: true,
            url: `https://${nconf.get('AUTH0_DOMAIN')}/api/users/${userId}/logs`,
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

  patchUser(userId, body) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/users/${encodeURIComponent(userId)}`,
        body: body,
        json: true,
        headers: {
          'Authorization': `Bearer ${nconf.get('AUTH0_APIV2_TOKEN')}`
        }
      };

      request.patch(req, (error, res, body) => {
        if (error || res.statusCode !== 200) {
          return reject(body);
        }

        resolve(body);
      });
    });
  }
}

export default new Auth0ApiClient();
