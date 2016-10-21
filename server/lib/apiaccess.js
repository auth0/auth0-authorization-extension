import Promise from 'bluebird';
import request from 'request-promise';
import config from './config';

let apiAccessInstance = null;

const makeRequest = (path, method, payload) => {
  const options = {
    method,
    uri: `https://${config('AUTH0_DOMAIN')}/api/v2/${path}`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config('AUTH0_APIV2_TOKEN')}`
    }
  };

  if (payload) {
    options.body = payload;
  }

  return request(options);
};

export default class ApiAccess {
  constructor(baseUrl) {
    if (!apiAccessInstance) {
      this.baseUrl = baseUrl;
      apiAccessInstance = this;
    }

    return apiAccessInstance;
  }

  getApi(id) {
    if (!id) {
      return Promise.resolve();
    }

    return makeRequest(`resource-servers/${id}`, 'GET');
  }

  createApi() {
    const payload = {
      name: 'auth0-authorization-extension-api',
      identifier: this.baseUrl,
      signing_alg: 'RS256'
    };

    return makeRequest('resource-servers', 'POST', payload);
  }

  updateApi(id, lifeTime) {
    if (!id) {
      return Promise.reject(new Error('Cannot update API access - no ID'));
    }

    const payload = {
      token_lifetime: lifeTime
    };

    return makeRequest(`resource-servers/${id}`, 'PATCH', payload);
  }

  deleteApi(id) {
    if (!id) {
      return Promise.reject(new Error('Cannot delete API access - no ID'));
    }

    return makeRequest(`resource-servers/${id}`, 'DELETE');
  }
}
