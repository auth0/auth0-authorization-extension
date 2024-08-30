import request from 'superagent';
import { faker } from '@faker-js/faker';

import config from '../../server/lib/config';

export const credentials = {
  audience: 'urn:auth0-authz-api',
  client_id: config('AUTH0_CLIENT_ID'),
  client_secret: config('AUTH0_CLIENT_SECRET'),
  grant_type: 'client_credentials'
};

/*
 * Get an access token for the Authorization Extension API.
 */
export const getAccessToken = async () => {
  const result = await request
    .post(`https://${config('AUTH0_DOMAIN')}/oauth/token`)
    .send(credentials)
    .set('Content-Type', 'application/json');
  
  return result.body.access_token;
};

export const authzApi = (endpoint) => (config('AUTHZ_API_URL') + endpoint);

// Splits an array into chunked sub-arrays.
export const chunks = (array, size) => {
  const items = [ ...array ];
  const results = [];
  while (items.length) {
    results.push(items.splice(0, size));
  }
  return results;
};

let accessToken;

const setAccessToken = async () => { 
  accessToken = await getAccessToken();
}

export const createGroup = async () => {
  if (!accessToken) {
    await setAccessToken();
  }

  const group = {
    name: faker.lorem.slug(),
    description: faker.lorem.sentence()
  };

  const result = await request
    .post(authzApi('/groups'))
    .send(group)
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

  return result.body;
};

export const createRole = async (permissionIds) => {
  if (!accessToken) {
    await setAccessToken();
  }

  const role = {
    name: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    applicationType: 'client',
    applicationId,
    permissions: permissionIds ?? []
  };

  const result = await request
    .post(authzApi('/roles'))
    .send(role)
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

  return result.body;
};

export const createPermission = async () => {
  if (!accessToken) {
    await setAccessToken();
  }

  const permission = {
    name: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    applicationType: 'client',
    applicationId,
  };

  const result = await request
    .post(authzApi('/permissions'))
    .send(permission)
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

  return result.body;
};

export const addGroupRoles = async (groupId, roleIds) => {
  if (!accessToken) {
    await setAccessToken();
  }

  const result = await request
    .patch(authzApi(`/groups/${groupId}/roles`))
    .send(roleIds)
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

  return result.body;
};


export const applicationId = 'fake-app-id';
export const groupMemberName1 = 'auth0|test-user-12345-1';
export const groupMemberName2 = 'auth0|test-user-12345-2';