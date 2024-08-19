import request from 'superagent';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import { getAccessToken, authzApi, token } from './utils';

/* eslint-disable no-underscore-dangle, no-shadow */

let accessToken;

const createPermission = async () => {
  const permission = {
    name: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    applicationType: 'client',
    applicationId: faker.lorem.slug()
  };

  const result = await request
    .post(authzApi('/permissions'))
    .send(permission)
    .set('Authorization', `Bearer ${accessToken}`)
    .accept('json');

  return result.body;
};


describe('permissions', () => {
  before(async () => {
    const response = await getAccessToken();
    accessToken = response;
    await request
      .post(authzApi('/configuration/import'))
      .set(token(accessToken))
      .send({});
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

  it('should create a new permission', async () => {
    const newPermission = await createPermission();

    const { body: permissionData } = await request
      .get(authzApi(`/permissions/${newPermission._id}`))
      .set(token(accessToken));

    expect(newPermission.name).toEqual(permissionData.name);
    expect(newPermission.description).toEqual(permissionData.description);
  });


  it('should get all permissions in the system', async () => {
    const [ permission1, permission2, permission3 ] = await Promise.all(
      [ createPermission(), createPermission(), createPermission() ]
    );

    const { body: data } = await request
      .get(authzApi('/permissions'))
      .set(token(accessToken));

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
      .set(token(accessToken));
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
      .set(token(accessToken))
      .send(newData);

    const { body: updatedPermissionGet } = await request
      .get(authzApi(`/permissions/${newPermission._id}`))
      .set(token(accessToken));

    expect(updatedPermissionPut.name).toEqual(updatedPermissionGet.name);
    expect(updatedPermissionPut.description).toEqual(updatedPermissionGet.description);
  });

  it('should delete a permission', async () => {
    const newPermission = await createPermission();

    await request
      .delete(authzApi(`/permissions/${newPermission._id}`))
      .set(token(accessToken));

    try {
      await request
        .get(authzApi(`/permissions/${newPermission._id}`))
        .set(token(accessToken));
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
});
