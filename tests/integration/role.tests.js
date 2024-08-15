/* eslint-disable no-underscore-dangle, no-shadow */

import request from 'request-promise';
import expect from 'expect';
import { faker } from '@faker-js/faker';
import { getAccessToken, authzApi, token } from './utils';

let accessToken;
let remoteRole;

describe('roles', () => {
  before(() => getAccessToken()
    .then(response => {
      accessToken = response;
      return request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(accessToken), resolveWithFullResponse: true });
    })
  );

  it('should have an accessToken', () => {
    expect(accessToken).toBeDefined();
  });

  it('should create a new role', () => {
    const role = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: 'client',
      applicationId: faker.lorem.slug(),
      permissions: []
    };

    return request.post({
      url: authzApi('/roles'),
      form: role,
      headers: token(accessToken),
      json: true
    })
    .then((data) => {
      remoteRole = data;

      // Check the role is stored in the server
      return request.get({
        url: authzApi(`/roles/${remoteRole._id}`),
        headers: token(accessToken),
        json: true
      })
      .then((data) => {
        expect(remoteRole.name).toEqual(data.name);
        expect(remoteRole.description).toEqual(data.description);
      });
    });
  });

  it('should get all roles in the system', () =>
    request.get({
      url: authzApi('/roles'),
      headers: token(accessToken),
      json: true
    })
    .then((data) => {
      expect(data.roles.length).toBeGreaterThan(0);
    })
  );

  it('should get a single role based on its unique identifier', () =>
    request.get({
      url: authzApi(`/roles/${remoteRole._id}`),
      headers: token(accessToken),
      json: true
    })
  );

  it('should update a role', () => {
    const newData = Object.assign({}, remoteRole, {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    });

    delete newData._id;

    return request.put({
      url: authzApi(`/roles/${remoteRole._id}`),
      form: newData,
      headers: token(accessToken),
      json: true
    })
    .then((data) => {
      remoteRole = data;

      // Check the role was updated in the server
      return request.get({
        url: authzApi(`/roles/${remoteRole._id}`),
        headers: token(accessToken),
        json: true
      })
      .then((data) => {
        expect(remoteRole.name).toEqual(data.name);
        expect(remoteRole.description).toEqual(data.description);
      });
    });
  });

  it('should delete a role', (done) => {
    request.delete({
      url: authzApi(`/roles/${remoteRole._id}`),
      headers: token(accessToken),
      resolveWithFullResponse: true
    })
    .then(() => {
      // Check the role was deleted in the server
      request.get({
        url: authzApi(`/roles/${remoteRole._id}`),
        headers: token(accessToken),
        json: true
      })
      .then((data) => {
        expect(remoteRole.name).toNotEqual(data.name);
        expect(remoteRole.description).toNotEqual(data.description);
        done();
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
