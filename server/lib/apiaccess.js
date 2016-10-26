import Promise from 'bluebird';
import request from 'superagent';
import { managementApi } from 'auth0-extension-tools';
import config from './config';

const apiIdentifier = 'urn:auth0-authz-api';
const allScopes = [
  { value: 'read:users' },
  { value: 'read:applications' },
  { value: 'read:connections' },
  { value: 'read:configuration' },
  { value: 'update:configuration' },
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
  { value: 'delete:permissions' },
  { value: 'read:resource-server' },
  { value: 'create:resource-server' },
  { value: 'update:resource-server' },
  { value: 'delete:resource-server' }
];

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

export const getApi = () =>
  makeRequest('resource-servers', 'GET')
    .then(apis => {
      const api = apis.filter(item => item.identifier === apiIdentifier);

      return api[0] || {};
    });

export const createApi = (lifeTime) => {
  const payload = {
    name: 'auth0-authorization-extension-api',
    identifier: apiIdentifier,
    signing_alg: 'RS256',
    scopes: allScopes,
    token_lifetime: lifeTime
  };

  return makeRequest('resource-servers', 'POST', payload);
};

export const updateApi = (lifeTime) =>
  getApi()
    .then(api => {
      const defaultLifetimeValue = 86400;

      if (!api.id) {
        return createApi(lifeTime || defaultLifetimeValue);
      }

      return makeRequest(`resource-servers/${api.id}`, 'PATCH', { token_lifetime: lifeTime || defaultLifetimeValue });
    });


export const deleteApi = () =>
  getApi()
    .then(api => {
      if (!api.id) {
        return Promise.reject(new Error('Unable to disable resource-server. Is it enabled?'));
      }

      return makeRequest(`resource-servers/${api.id}`, 'DELETE');
    });

export const scopes = allScopes;
