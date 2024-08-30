/* eslint-disable no-underscore-dangle, no-shadow */

import Promise from 'bluebird';
import { expect } from 'expect';
import { faker } from '@faker-js/faker';
import request from 'superagent';
import {
  getAccessToken,
  authzApi,
  createRole,
  createGroup,
  createPermission,
  addGroupRoles,
  groupMemberName1,
  groupMemberName2
} from './utils';

let accessToken;

const parallelGroups = [ ...new Array(20) ].map(() => ({
  name: faker.lorem.slug(),
  description: faker.lorem.sentence()
}));

describe('groups', () => {
  before(async () => {
    accessToken = await getAccessToken();

    await request
      .post(authzApi('/configuration/import'))
      .send({})
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');
  });

  afterEach(async () => {
    // clear data to prevent state leaking between tests
    await request
      .post(authzApi('/configuration/import'))
      .auth(accessToken, { type: 'bearer' })
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
    await createGroup();
    await createRole();

    const response = await request
      .get(authzApi('/configuration/export'))
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');

    const exportedDataKeys = Object.keys(response.body);
    expect(exportedDataKeys).toEqual([ 'groups', 'roles' ]);
  });

  it('should create a new group', async () => {
    const newGroup = await createGroup();
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
  }).timeout(30000);

  it('should delete group', async () => {
    const newGroup = await createGroup();

    const deleteResult = await request
      .delete(authzApi(`/groups/${newGroup._id}`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');

    expect(deleteResult.statusCode).toEqual(204);

    try {
      await request
      .get(authzApi(`/groups/${newGroup._id}`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');
    } catch (error) {
      expect(error.response._body).toEqual(expect.objectContaining({
        statusCode: 404,
        error: 'NotFoundError',
        message: `The record ${newGroup._id} in groups does not exist.`
      }));
      return;
    }

    throw new Error('Expected an error to be thrown when fetching a deleted group');
  });

  it('should not delete group with another group nested below it', async () => {
    const [ group1, group2 ] = await Promise.all([ createGroup(), createGroup() ]);

    // nest group2 under group1
    await request
      .patch(authzApi(`/groups/${group1._id}/nested`))
      .auth(accessToken, { type: 'bearer' })
      .send([ group2._id ]);

    try {
      await request
      .delete(authzApi(`/groups/${group2._id}`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');
    } catch (error) {
      expect(error.response._body).toEqual(expect.objectContaining({
        statusCode: 400,
        error: 'ValidationError',
        message: `Unable to touch nested while used in groups: ${group1.name}`
      }));
      return;
    }

    throw new Error('Expected an error to be thrown when deleting a group with nested groups');
  });

  it('should get all groups in the system', async () => {
    await createGroup();

    const response = await request
      .get(authzApi('/groups'))
      .set('Authorization', `Bearer ${accessToken}`)
      .accept('json');

    expect(response.body.groups.length).toBeGreaterThan(0);
  });

  it('should get a single group based on its unique identifier', async () => {
    const newGroup = await createGroup();

    const response = await request
      .get(authzApi(`/groups/${newGroup._id}`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');

    expect(newGroup.name).toEqual(response.body.name);
    expect(newGroup.description).toEqual(response.body.description);
  });

  it('should get a single expanded group based on its unique identifier', async () => {
    const [ perm1, perm2, perm3 ] = await Promise.all([
      createPermission(),
      createPermission(),
      createPermission()
    ]);
    const [ role1, role2 ] = await Promise.all([
      createRole([ perm1._id, perm2._id ]),
      createRole([ perm3._id ])
    ]);
    const newGroup = await createGroup();

    await addGroupRoles(newGroup._id, [ role1._id, role2._id ]);

    const response = await request
      .get(authzApi(`/groups/${newGroup._id}?expand=true`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');

    const expandedGroup = response.body;

    expect(expandedGroup).toBeInstanceOf(Object);
    expect(expandedGroup.name).toEqual(newGroup.name);
    expect(expandedGroup.description).toEqual(newGroup.description);
    expect(expandedGroup.roles).toBeInstanceOf(Array);
    expect(expandedGroup.roles.length).toEqual(2);
    expect(expandedGroup.roles.map(role => role._id)).toEqual(expect.arrayContaining([ role1._id, role2._id ]));

    const addedRole1 = expandedGroup.roles.find(role => role._id === role1._id);
    const addedRole2 = expandedGroup.roles.find(role => role._id === role2._id);

    expect(addedRole1.permissions).toBeInstanceOf(Array);
    expect(addedRole1.permissions.length).toEqual(2);
    expect(addedRole1.permissions.map(perm => perm._id)).toEqual(expect.arrayContaining([ perm1._id, perm2._id ]));

    expect(addedRole2.permissions.length).toEqual(1);
    expect(addedRole2.permissions[0]._id).toEqual(perm3._id);
  }).timeout(30000);

  it('should update a group', async () => {
    const newGroup = await createGroup();

    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    await request
      .put(authzApi(`/groups/${newGroup._id}`))
      .auth(accessToken, { type: 'bearer' })
      .send(newData)
      .accept('json');

  // Check the group was updated in the server
    const updatedGroup = await request
      .get(authzApi(`/groups/${newGroup._id}`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');

    expect(updatedGroup.body.name).toEqual(newData.name);
    expect(updatedGroup.body.description).toEqual(newData.description);
  });

  describe('mappings', () => {
    let newGroup;

    beforeEach(async () => {
      newGroup = await createGroup();

      const mappings = [ { groupName: 'My groupName', connectionName: 'google-oauth2' } ];

      await request
        .patch(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .send(mappings)
        .accept('json');

      const groupMappings = await request
        .get(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(groupMappings.body.length).toEqual(1);
      expect(groupMappings.body[0].groupName).toEqual('My groupName');
      expect(groupMappings.body[0].connectionName).toEqual('google-oauth2 (google-oauth2)');
    });

    it('should add mappings to a group', async () => {
      const mappings = [ { groupName: 'My groupName2', connectionName: 'google-oauth2' } ];

      await request
        .patch(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .send(mappings)
        .accept('json');

      const groupMappings = await request
        .get(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(groupMappings.body.length).toEqual(2);
      expect(groupMappings.body[1].groupName).toEqual('My groupName2');
      expect(groupMappings.body[1].connectionName).toEqual('google-oauth2 (google-oauth2)');
    });

    it('should get the mappings of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should remove mappings of a group', async () => {
      // Get the current mappings
      const mappingsResponse = await request
        .get(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      const mappings = mappingsResponse.body;
      const mappingCount = mappings.length;
      const mapping = mappings[0];

      // Delete the first mapping
      const deleteResponse = await request
        .delete(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .send([ mapping._id ])
        .accept('json');

      expect(deleteResponse.status).toEqual(204);

      // Verify the mapping count has decreased by 1
      const finalMappingsResponse = await request
        .get(authzApi(`/groups/${newGroup._id}/mappings`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(finalMappingsResponse.body.length).toEqual(mappingCount - 1);
    });
  });

  describe('group members', () => {
    let newGroup;

    beforeEach(async () => {
      newGroup = await createGroup();

      await request
        .patch(authzApi(`/groups/${newGroup._id}/members`))
        .auth(accessToken, { type: 'bearer' })
        .send([ groupMemberName1 ])
        .accept('json');
    });

    it('should add members to a group', async () => {
      await request
        .patch(authzApi(`/groups/${newGroup._id}/members`))
        .auth(accessToken, { type: 'bearer' })
        .send([ groupMemberName2 ])
        .accept('json');

      const data = await request
        .get(authzApi(`/groups/${newGroup._id}/members`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(data.body.users.find((member) => member.user_id === groupMemberName2)).toBeDefined();
    });

    it('should get the members of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${newGroup._id}/members`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(response.body).toBeDefined();
    });

    it('should remove members from a group', async () => {
      await request
        .delete(authzApi(`/groups/${newGroup._id}/members`))
        .auth(accessToken, { type: 'bearer' })
        .send([ groupMemberName1 ])
        .accept('json');

      const data = await request
        .get(authzApi(`/groups/${newGroup._id}/members`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(data.body.users.find((member) => member.user_id === groupMemberName1)).not.toBeDefined();
    });

    it('should get the nested members of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${newGroup._id}/members/nested`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(response.body).toBeDefined();
    });
  });

  describe('group roles', () => {
    let newGroup;
    let newRole;

    beforeEach(async () => {
      newGroup = await createGroup();
      newRole = await createRole();

      await request
        .patch(authzApi(`/groups/${newGroup._id}/roles`))
        .auth(accessToken, { type: 'bearer' })
        .send([ newRole._id ])
        .accept('json');
    });

    it('should add roles to a group', async () => {
      const group1 = await createGroup();
      const role1 = await createRole();

      const patchResult = await request
        .patch(authzApi(`/groups/${group1._id}/roles`))
        .auth(accessToken, { type: 'bearer' })
        .send([ role1._id ])
        .accept('json');

      expect(patchResult.statusCode).toEqual(204);

      const res2 = await request
        .get(authzApi(`/groups/${group1._id}/roles`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(res2.body.find((role) => role._id === role1._id)).toBeDefined();
    });

    it('should get the roles of a group', async () => {
      const res = await request
      .get(authzApi(`/groups/${newGroup._id}/roles`))
      .auth(accessToken, { type: 'bearer' })
      .accept('json');

      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete roles from a group', async () => {
      await request
        .delete(authzApi(`/groups/${newGroup._id}/roles`))
        .auth(accessToken, { type: 'bearer' })
        .send([ newRole._id ])
        .accept('json');

      const res = await request
        .get(authzApi(`/groups/${newGroup._id}/roles`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(res.body.find((role) => role._id === newRole._id)).not.toBeDefined();
    });

    it('should get the nested roles of a group', async () => {
      const response = await request
        .get(authzApi(`/groups/${newGroup._id}/roles/nested`))
        .auth(accessToken, { type: 'bearer' })
        .accept('json');

      expect(response.body).toBeDefined();
    });
  });
});
