import Promise from 'bluebird';
import request from 'superagent';
import { managementApi } from 'auth0-extension-tools';
import config from './config';

let apiAccessInstance = null;
const apiIdentifier = 'urn:auth0-authz-api';

const getToken = () =>
  managementApi.getAccessTokenCached(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'));

const makeRequest = (path, method, payload) =>
  new Promise((resolve, reject) =>
    getToken().then(token => {
      request(method, `https://${config('AUTH0_DOMAIN')}/api/v2/${path}`)
        .send(payload || {})
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.body);
        });
    }));

export default class ApiAccess {
  constructor() {
    if (!apiAccessInstance) {
      apiAccessInstance = this;
    }

    return apiAccessInstance;
  }

  getApi(returnEmpty) {
    return makeRequest('resource-servers', 'GET')
      .then(apis => {
        const api = apis.filter(item => item.identifier === apiIdentifier);

        if (api.length !== 1 && returnEmpty) {
          return {};
        } else if (api.length !== 1) {
          return Promise.reject(new Error('Cannot find auth0-authz-api'));
        }

        return api[0];
      });
  }

  createApi() {
    const payload = {
      name: 'auth0-authorization-extension-api',
      identifier: apiIdentifier,
      signing_alg: 'RS256',
      scopes: [
        { value: 'read:users' },
        { value: 'read:groups' },
        { value: 'create:groups' },
        { value: 'update:groups' },
        { value: 'delete:groups' },
        { value: 'read:roles' },
        { value: 'create:roles' },
        { value: 'update:roles' },
        { value: 'delete:roles' },
        { value: 'read:permissions' },
        { value: 'create:permissions' },
        { value: 'update:permissions' },
        { value: 'delete:permissions' }
      ]
    };

    return makeRequest('resource-servers', 'POST', payload);
  }

  updateApi(lifeTime) {
    return this.getApi()
      .then(api => makeRequest(`resource-servers/${api.id}`, 'PATCH', { token_lifetime: lifeTime }));
  }

  deleteApi() {
    return this.getApi()
      .then(api => makeRequest(`resource-servers/${api.id}`, 'DELETE'));
  }
}
