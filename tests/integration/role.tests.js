import request from 'superagent';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import { getAccessToken, authzApi, createRole, createGroup, addGroupRoles } from './utils';

/* eslint-disable no-underscore-dangle, no-shadow */

let accessToken;

describe('roles', () => {
  before(async () => {
    const response = await getAccessToken();
    accessToken = response;

    await request
      .post(authzApi('/configuration/import'))
      .auth(accessToken, { type: 'bearer' })
      .send({});
  });

  it('should have an accessToken', () => {
    expect(accessToken).toBeDefined();
  });

  afterEach(async () => {
    // clear data to prevent state leaking between tests
    await request
      .post(authzApi('/configuration/import'))
      .auth(accessToken, { type: 'bearer' })
      .send({});
  });

  it('should create a new role', async () => {
    const newRole = await createRole();

    const { body: storedRole } = await request
      .get(authzApi(`/roles/${newRole._id}`))
      .auth(accessToken, { type: 'bearer' });

    expect(newRole.name).toEqual(storedRole.name);
    expect(newRole.description).toEqual(storedRole.description);
  });

  it('should get all roles in the system', async () => {
    const [ role1, role2, role3 ] = await Promise.all([ createRole(), createRole(), createRole() ]);

    const { body: data } = await request
      .get(authzApi('/roles'))
      .auth(accessToken, { type: 'bearer' });

    expect(data.roles.length).toEqual(3);
    expect(data.total).toEqual(3);
    expect(data.roles.map(role => role._id)).toEqual(
      expect.arrayContaining([ role1._id, role2._id, role3._id ])
    );
  });

  it('should get a single role based on its unique identifier', async () => {
    const newRoleCreate = await createRole();

    const newRoleGet = await request
      .get(authzApi(`/roles/${newRoleCreate._id}`))
      .auth(accessToken, { type: 'bearer' });

    expect(newRoleGet.body._id).toEqual(newRoleCreate._id);
  });

  it('should update a role', async () => {
    const newRole = await createRole();

    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: newRole.applicationType,
      applicationId: newRole.applicationId
    };

    const { body: updatedRolePut } = await request
      .put(authzApi(`/roles/${newRole._id}`))
      .auth(accessToken, { type: 'bearer' })
      .send(newData);


    const { body: updatedRoleGet } = await request
      .get(authzApi(`/roles/${newRole._id}`))
      .auth(accessToken, { type: 'bearer' });

    expect(updatedRolePut.name).toEqual(updatedRoleGet.name);
    expect(updatedRolePut.description).toEqual(updatedRoleGet.description);
  });

  it('should delete a role', async () => {
    const newRole = await createRole();

    await request
      .delete(authzApi(`/roles/${newRole._id}`))
      .auth(accessToken, { type: 'bearer' });

    try {
      await request
        .get(authzApi(`/roles/${newRole._id}`))
        .auth(accessToken, { type: 'bearer' });
    } catch (error) {
      expect(error.response._body).toEqual({
        statusCode: 404,
        error: 'NotFoundError',
        message: `The record ${newRole._id} in roles does not exist.`
      });
      return;
    }

    throw new Error('expected to throw an error');
  });

  it('should not delete a role which is used by a group', async () => {
    const newRole = await createRole();
    const newGroup = await createGroup();
    await addGroupRoles(newGroup._id, [ newRole._id ]);

    try {
      await request
      .delete(authzApi(`/roles/${newRole._id}`))
      .auth(accessToken, { type: 'bearer' });
    } catch (error) {
      expect(error.response._body).toEqual({
        statusCode: 400,
        error: 'ValidationError',
        message: `Unable to touch roles while used in groups: ${newGroup.name}`
      });
      return;
    }

    throw new Error('expected to throw an error');
  });
});
