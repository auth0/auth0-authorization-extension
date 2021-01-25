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

const getToken = (req) => {
  const isAdministrator =
    req.auth &&
    req.auth.credentials &&
    req.auth.credentials.access_token &&
    req.auth.credentials.access_token.length;
  if (isAdministrator) {
    return Promise.resolve(req.auth.credentials.access_token);
  }

  return managementApi.getAccessTokenCached(
    config('AUTH0_DOMAIN'),
    config('AUTH0_CLIENT_ID'),
    config('AUTH0_CLIENT_SECRET')
  );
};

const makeRequest = (req, path, method, payload) =>
  new Promise((resolve, reject) =>
    getToken(req).then((token) => {
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
    })
  );

export const getApi = (req) =>
  makeRequest(req, `resource-servers/${apiIdentifier}`, 'GET').catch(e => { return {}; });

export const createApi = (req, lifeTime) => {
  const payload = {
    name: 'auth0-authorization-extension-api',
    identifier: apiIdentifier,
    signing_alg: 'RS256',
    scopes: allScopes,
    token_lifetime: lifeTime
  };

  return makeRequest(req, 'resource-servers', 'POST', payload);
};

export const updateApi = (req, lifeTime) =>
  getApi(req).then((api) => {
    const defaultLifetimeValue = 86400;

    if (!api.id) {
      return createApi(req, lifeTime || defaultLifetimeValue);
    }

    return makeRequest(req, `resource-servers/${api.id}`, 'PATCH', {
      token_lifetime: lifeTime || defaultLifetimeValue
    });
  });

export const deleteApi = (req, silent) =>
  getApi(req).then((api) => {
    if (api.id) {
      return makeRequest(req, `resource-servers/${api.id}`, 'DELETE');
    }

    if (!api.id && !silent) {
      return Promise.reject(
        new Error('Unable to disable resource-server. Is it enabled?')
      );
    }

    return Promise.resolve();
  });

export const scopes = allScopes;
