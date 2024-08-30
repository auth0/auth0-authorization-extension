import request from 'superagent';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import { getAccessToken, authzApi, createPermission, createRole } from './utils';

/* eslint-disable no-underscore-dangle, no-shadow */

let accessToken;

describe('permissions', () => {
  before(async () => {
    const response = await getAccessToken();
    accessToken = response;
    await request
      .post(authzApi('/configuration/import'))
      .auth(accessToken, { type: 'bearer' })
      .send({});
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

  it('should create a new permission', async () => {
    const newPermission = await createPermission();

    const { body: permissionData } = await request
      .get(authzApi(`/permissions/${newPermission._id}`))
      .auth(accessToken, { type: 'bearer' });

    expect(newPermission.name).toEqual(permissionData.name);
    expect(newPermission.description).toEqual(permissionData.description);
  });


  it('should get all permissions in the system', async () => {
    const [ permission1, permission2, permission3 ] = await Promise.all(
      [ createPermission(), createPermission(), createPermission() ]
    );

    const { body: data } = await request
      .get(authzApi('/permissions'))
      .auth(accessToken, { type: 'bearer' });

    expect(data.permissions.length).toEqual(3);
    expect(data.total).toEqual(3);
    expect(data.permissions.map(permission => permission._id)).toEqual(
      expect.arrayContaining([ permission1._id, permission2._id, permission3._id ])
    );
  });

  it('should get a single permission based on its unique identifier', async () => {
    const newPermission = await createPermission();

    await request
      .get(authzApi(`/permissions/${newPermission._id}`))
      .auth(accessToken, { type: 'bearer' });
  });

  it('should update a permission', async () => {
    const newPermission = await createPermission();

    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: newPermission.applicationType,
      applicationId: newPermission.applicationId
    };

    const { body: updatedPermissionPut } = await request
      .put(authzApi(`/permissions/${newPermission._id}`))
      .auth(accessToken, { type: 'bearer' })
      .send(newData);

    const { body: updatedPermissionGet } = await request
      .get(authzApi(`/permissions/${newPermission._id}`))
      .auth(accessToken, { type: 'bearer' });

    expect(updatedPermissionPut.name).toEqual(updatedPermissionGet.name);
    expect(updatedPermissionPut.description).toEqual(updatedPermissionGet.description);
  });

  it('should delete a permission', async () => {
    const newPermission = await createPermission();

    await request
      .delete(authzApi(`/permissions/${newPermission._id}`))
      .auth(accessToken, { type: 'bearer' });

    try {
      await request
        .get(authzApi(`/permissions/${newPermission._id}`))
        .auth(accessToken, { type: 'bearer' });
    } catch (error) {
      expect(error.response._body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: `The record ${newPermission._id} in permissions does not exist.`
      });
      return;
    }

    throw new Error('expected to throw an error');
  });

  it('should not delete a permission which is used by a role', async () => {
    const newPermission = await createPermission();
    const newRole = await createRole([ newPermission._id ]);

    try {
      await request
      .delete(authzApi(`/permissions/${newPermission._id}`))
      .auth(accessToken, { type: 'bearer' });
    } catch (error) {
      expect(error.response._body).toEqual({
        statusCode: 400,
        error: 'ValidationError',
        message: `Unable to touch permissions while used in roles: ${newRole.name}`
      });
      return;
    }

    throw new Error('expected to throw an error');
  });
});
