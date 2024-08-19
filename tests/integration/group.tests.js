/* eslint-disable no-underscore-dangle, no-shadow */

import Promise from 'bluebird';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import request from 'superagent';
import { getAccessToken, authzApi, token } from './utils';


let accessToken;
const groupMemberName1 = 'auth0|test-user-12345-1';
const groupMemberName2 = 'auth0|test-user-12345-2';

const parallelGroups = [ ...new Array(10) ].map(() => ({
  name: faker.lorem.slug(),
  description: faker.lorem.sentence()
}));

const createTestGroup = async () => {
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

const createTestRole = async () => {
  const role = {
    name: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    applicationType: 'client',
    applicationId: faker.lorem.slug(),
    permissions: []
  };

  const result = await request
    .post(authzApi('/roles'))
    .send(role)
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

  return result.body;
};

describe('groups', () => {
  before(async () => {
    accessToken = await getAccessToken();

    await request
      .post(authzApi('/configuration/import'))
      .send({})
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');
  });

  let testGroup;
  let testRole;

  beforeEach(async () => {
    testGroup = await createTestGroup();
    testRole = await createTestRole();
  });

  afterEach(async () => {
    // clear data to prevent state leaking between tests
    await request
      .post(authzApi('/configuration/import'))
      .set(token(accessToken))
      .send({});
  });

  it('should have an accessToken', () => {
    expect(accessToken).toBeDefined();
  });

  it('should import data', async () => {
    const response = await request
      .post(authzApi('/configuration/import'))
      .send({})
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');
    expect(response.statusCode).toEqual(204);
  });


  it('should export data', async () => {
    const response = await request
      .get(authzApi('/configuration/export'))
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');

    const exportedDataKeys = Object.keys(response.body);
    expect(exportedDataKeys).toEqual([ 'groups', 'roles' ]);
  });

  it('should create a new group', async () => {
    const newGroup = await createTestGroup();
    const response = await request
      .get(authzApi(`/groups/${newGroup._id}`))
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');


    expect(newGroup.name).toEqual(response.body.name);
    expect(newGroup.description).toEqual(response.body.description);
  });

  it('should create many groups in parallel', async () => {
    const creationRequests = parallelGroups.map(async (groupData) => {
      await request
        .post(authzApi('/groups'))
        .send(groupData)
        .set('Authorization', `Bearer ${accessToken}`)
        .accept('json');
    });

    await Promise.all(creationRequests);

    const response = await request
      .get(authzApi('/groups'))
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');

    parallelGroups.forEach((group) => {
      expect(response.body.groups.find((g) => g.name === group.name)).toBeDefined();
    });
  });

  it('should delete group', async () => {
    const deleteResult = await request
      .delete(authzApi(`/groups/${testGroup._id}`))
      .set(token(accessToken))
      .accept('json');

    expect(deleteResult.statusCode).toEqual(204);

    await expect(request.get({
      url: authzApi(`/groups/${testGroup._id}`),
      headers: token(accessToken),
      json: true
    }).catch(caughtError => {
      // annoyingly, the error thrown by request-promise is a weird type so we have to wrap it in a new Error
      throw new Error({
        statusCode: caughtError.statusCode,
        error: caughtError.error,
        message: caughtError.message
      });
    })).rejects.toThrow(new Error({
      statusCode: 400,
      error: 'Bad Request',
      message: `The record ${testGroup._id} in groups does not exist.`
    }));
  });

  it('should get all groups in the system', async () => {
    const response = await request
    .get(authzApi('/groups'))
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

    expect(response.body.groups.length).toBeGreaterThan(0);
  });

  it('should get a single group based on its unique identifier', async () => {
    const response = await request
    .get(authzApi(`/groups/${testGroup._id}`))
    .set(token(accessToken))
    .accept('json');

    expect(testGroup.name).toEqual(response.body.name);
    expect(testGroup.description).toEqual(response.body.description);
  });

  it('should update a group', async () => {
    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    await request
    .put(authzApi(`/groups/${testGroup._id}`))
    .set(token(accessToken))
    .send(newData)
    .accept('json');

  // Check the group was updated in the server
    const updatedGroup = await request
    .get(authzApi(`/groups/${testGroup._id}`))
    .set(token(accessToken))
    .accept('json');

    expect(updatedGroup.body.name).toEqual(newData.name);
    expect(updatedGroup.body.description).toEqual(newData.description);
  });

  describe('mappings', () => {
    beforeEach(async () => {
      const mappings = [ { groupName: 'My groupName', connectionName: 'google-oauth2' } ];

      await request
        .patch(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .send(mappings)
        .accept('json');

      const groupMappings = await request
        .get(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .accept('json');

      expect(groupMappings.body.length).toEqual(1);
      expect(groupMappings.body[0].groupName).toEqual('My groupName');
      expect(groupMappings.body[0].connectionName).toEqual('google-oauth2 (google-oauth2)');
    });

    it('should add mappings to a group', async () => {
      const mappings = [ { groupName: 'My groupName2', connectionName: 'google-oauth2' } ];

      await request
        .patch(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .send(mappings)
        .accept('json');

      const groupMappings = await request
        .get(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .accept('json');

      expect(groupMappings.body.length).toEqual(2);
      expect(groupMappings.body[1].groupName).toEqual('My groupName2');
      expect(groupMappings.body[1].connectionName).toEqual('google-oauth2 (google-oauth2)');
    });

    it('should get the mappings of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .accept('json');

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should remove mappings of a group', async () => {
      // Get the current mappings
      const mappingsResponse = await request
        .get(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .accept('json');

      const mappings = mappingsResponse.body;
      const mappingCount = mappings.length;
      const mapping = mappings[0];

      // Delete the first mapping
      const deleteResponse = await request
        .delete(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .send([ mapping._id ])
        .accept('json');

      expect(deleteResponse.status).toEqual(204);

      // Verify the mapping count has decreased by 1
      const finalMappingsResponse = await request
        .get(authzApi(`/groups/${testGroup._id}/mappings`))
        .set(token(accessToken))
        .accept('json');

      expect(finalMappingsResponse.body.length).toEqual(mappingCount - 1);
    });
  });

  describe('group members', () => {
    beforeEach(async () => {
      await request
        .patch(authzApi(`/groups/${testGroup._id}/members`))
        .set(token(accessToken))
        .send([ groupMemberName1 ])
        .accept('json');
    });

    it('should add members to a group', async () => {
      await request
        .patch(authzApi(`/groups/${testGroup._id}/members`))
        .set(token(accessToken))
        .send([ groupMemberName2 ])
        .accept('json');

      const data = await request
        .get(authzApi(`/groups/${testGroup._id}/members`))
        .set(token(accessToken))
        .accept('json');

      expect(data.body.users.find((member) => member.user_id === groupMemberName2)).toBeDefined();
    });

    it('should get the members of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${testGroup._id}/members`))
        .set(token(accessToken))
        .accept('json');

      expect(response.body).toBeDefined();
    });

    it('should remove members from a group', async () => {
      await request
        .delete(authzApi(`/groups/${testGroup._id}/members`))
        .set(token(accessToken))
        .send([ groupMemberName1 ])
        .accept('json');

      const data = await request
        .get(authzApi(`/groups/${testGroup._id}/members`))
        .set(token(accessToken))
        .accept('json');

      expect(data.body.users.find((member) => member.user_id === groupMemberName1)).not.toBeDefined();
    });

    it('should get the nested members of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${testGroup._id}/members/nested`))
        .set(token(accessToken))
        .accept('json');

      expect(response.body).toBeDefined();
    });
  });

  describe('group roles', () => {
    beforeEach(async () => {
      await request
        .patch(authzApi(`/groups/${testGroup._id}/roles`))
        .set(token(accessToken))
        .send([ testRole._id ])
        .accept('json');
    });

    it('should add roles to a group', async () => {
      await request
        .patch(authzApi(`/groups/${testGroup._id}/roles`))
        .set(token(accessToken))
        .send([ testRole._id ])
        .accept('json');

      const res = await request
        .get(authzApi(`/groups/${testGroup._id}/roles`))
        .set(token(accessToken))
        .accept('json');

      expect(res.body.find((role) => role._id === testRole._id)).toBeDefined();
    });

    it('should get the roles of a group', async () => {
      const res = await request
      .get(authzApi(`/groups/${testGroup._id}/roles`))
      .set(token(accessToken))
      .accept('json');

      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete roles from a group', async () => {
      await request
        .delete(authzApi(`/groups/${testGroup._id}/roles`))
        .set(token(accessToken))
        .send([ testRole._id ])
        .accept('json');

      const res = await request
        .get(authzApi(`/groups/${testGroup._id}/roles`))
        .set(token(accessToken))
        .accept('json');

      expect(res.body.find((role) => role._id === testRole._id)).not.toBeDefined();
    });

    it('should get the nested roles of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${testGroup._id}/roles/nested`))
        .set(token(accessToken))
        .accept('json');

      expect(response.body).toBeDefined();
    });
  });
});
