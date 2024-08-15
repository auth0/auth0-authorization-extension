/* eslint-disable no-underscore-dangle, no-shadow */

import request from 'request-promise';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import { getAccessToken, authzApi, token } from './utils';

let accessToken;
let remotePermission;

describe('permissions', () => {
  before(() => getAccessToken()
    .then(response => {
      accessToken = response;
      return request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(accessToken), resolveWithFullResponse: true });
    })
  );

  it('should have an accessToken', () => {
    expect(accessToken).toBeDefined();
  });

  it('should create a new permission', () => {
    const permission = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: 'client',
      applicationId: faker.lorem.slug()
    };

    return request.post({
      url: authzApi('/permissions'),
      form: permission,
      headers: token(accessToken),
      json: true
    })
    .then((data) => {
      remotePermission = data;
      return request.get({
        url: authzApi(`/permissions/${remotePermission._id}`),
        headers: token(accessToken),
        json: true
      })
        .then((data) => {
          expect(remotePermission.name).toEqual(data.name);
          expect(remotePermission.description).toEqual(data.description);
        });
    });
  });

  it('should get all permissions in the system', () =>
    request.get({
      url: authzApi('/permissions'),
      headers: token(accessToken),
      json: true
    })
    .then((data) => {
      expect(data.permissions.length).toBeGreaterThan(0);
    })
  );

  it('should get a single permission based on its unique identifier', () =>
    request.get({
      url: authzApi(`/permissions/${remotePermission._id}`),
      headers: token(accessToken),
      json: true
    })
  );

  it('should update a permission', () => {
    const newData = Object.assign({}, remotePermission, {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    });

    delete newData._id;

    return request.put({
      url: authzApi(`/permissions/${remotePermission._id}`),
      form: newData,
      headers: token(accessToken),
      json: true
    })
    .then((data) => {
      remotePermission = data;

      // Check the permission was updated in the server
      return request.get({
        url: authzApi(`/permissions/${remotePermission._id}`),
        headers: token(accessToken),
        json: true
      })
      .then((data) => {
        expect(remotePermission.name).toEqual(data.name);
        expect(remotePermission.description).toEqual(data.description);
      });
    });
  });

  it('should delete a permission', (done) => {
    request.delete({
      url: authzApi(`/permissions/${remotePermission._id}`),
      headers: token(accessToken),
      resolveWithFullResponse: true
    })
    .then(() => {
      // Check the permission was deleted in the server
      request.get({
        url: authzApi(`/groups/${remotePermission._id}`),
        headers: token(accessToken),
        json: true
      })
      .then((data) => {
        expect(remotePermission.name).toNotEqual(data.name);
        expect(remotePermission.description).toNotEqual(data.description);
      }).catch((err) => {
        if (err.statusCode === 400) {
          done();
        } else {
          done(err);
        }
      });
    }).catch(done);
  });
});
