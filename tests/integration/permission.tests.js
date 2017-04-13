const Promise = require('bluebird');
import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token } from './utils';

let accessToken;
let remotePermission;

describe('permissions', () => {
  before((done) => {
    getAccessToken()
      .then(response => {
        accessToken = response;
        request.post({
            url: authzApi('/configuration/import'),
            form: {},
            headers: token(),
            resolveWithFullResponse: true
          })
          .then(() => done());
      })
      .catch(err => done(err));
  });

  it('should have an accessToken', () => {
    expect(accessToken).toExist();
  });

  it('should create a new permission', (done) => {
    const permission = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: 'client',
      applicationId: faker.lorem.slug()
    };

    request.post({
        url: authzApi('/permissions'),
        form: permission,
        headers: token(),
        json: true
      })
      .then((data) => {
        remotePermission = data;
        request.get({
            url: authzApi(`/permissions/${remotePermission._id}`),
            headers: token(),
            json: true
          })
          .then((data) => {
            expect(remotePermission.name).toEqual(data.name);
            expect(remotePermission.description).toEqual(data.description);
            done();
          }).catch(done);
      }).catch(done);
  });

  it('should get all permissions in the system', (done) => {
    request.get({
        url: authzApi(`/permissions`),
        headers: token(),
        json: true
      })
      .then((data) => {
        data.permissions.length > 0 ? done() : done(new Error('Unexpected number of permissions.'));
      })
      .catch(done);
  });

  it('should get a single permission based on its unique identifier', (done) => {
    request.get({
        url: authzApi(`/permissions/${remotePermission._id}`),
        headers: token(),
        json: true
      })
      .then((data) => {
        done();
      }).catch(done);
  });

  it('should update a permission', (done) => {
    const newData = Object.assign({}, remotePermission, {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    });

    delete newData['_id'];

    request.put({
        url: authzApi(`/permissions/${remotePermission._id}`),
        form: newData,
        headers: token(),
        json: true
      })
      .then((data) => {
        remotePermission = data;

        // Check the permission was updated in the server
        request.get({
            url: authzApi(`/permissions/${remotePermission._id}`),
            headers: token(),
            json: true
          })
          .then((data) => {
            expect(remotePermission.name).toEqual(data.name);
            expect(remotePermission.description).toEqual(data.description);
            done();
          }).catch(done);
      })
      .catch(done);
  });

  it('should delete a permission', (done) => {
    request.delete({
        url: authzApi(`/permissions/${remotePermission._id}`),
        headers: token(),
        resolveWithFullResponse: true
      })
      .then((res) => {
        // Check the permission was deleted in the server
        request.get({
            url: authzApi(`/groups/${remotePermission._id}`),
            headers: token(),
            json: true
          })
          .then((data) => {
            expect(remotePermission.name).toNotEqual(data.name);
            expect(remotePermission.description).toNotEqual(data.description);
            done(new Error("The permission still exists, it should't."));
          }).catch((err) => {
            if (err.statusCode === 400) {
              done()
            } else {
              done(err);
            }
          });
      }).catch(done);
  });
});