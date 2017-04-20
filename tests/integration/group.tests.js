const Promise = require('bluebird');
import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token, credentials } from './utils';

const dataToImportExport = {};
let accessToken;
let remoteGroup;
let groupMemberName = 'auth0|test-user-12345';
let remoteRole;

describe('groups', () => {
  before((done) => {
    getAccessToken()
      .then(response => {
        accessToken = response;
        request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
          .then(() => done());
      })
      .catch(err => done(err));
  });

  it('should have an accessToken', () => {
    expect(accessToken).toExist();
  });

  it('should import data', (done) => {
    request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
      .then((response) => {
        expect(response.statusCode).toEqual(204);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should export data', (done) => {
    request.get({ url: authzApi('/configuration/export'), headers: token(), json: true })
      .then((data) => {
        expect(data).toEqual(dataToImportExport);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should create a new group', (done) => {
    const group = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    // Create the group
    request.post({ url: authzApi('/groups'), form: group, headers: token(), json: true })
      .then((data) => {
        remoteGroup = data;

        // Check the group is stored in the server
        request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
          .then((data) => {
            expect(remoteGroup.name).toEqual(data.name);
            expect(remoteGroup.description).toEqual(data.description);
            done();
          }).catch(done);
      }).catch(done);
  });

  it('should get all groups in the system', (done) => {
    request.get({ url: authzApi(`/groups`), headers: token(), json: true })
      .then((data) => {
        expect(data.groups.length).toEqual(1);
        done();
      })
      .catch(done);
  });

  it('should get a single group based on its unique identifier', (done) => {
    request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
      .then((data) => {
        expect(remoteGroup.name).toEqual(data.name);
        expect(remoteGroup.description).toEqual(data.description);
        done();
      }).catch(done);
  });

  it('should update a group', (done) => {
    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    request.put({ url: authzApi(`/groups/${remoteGroup._id}`), form: newData, headers: token(), json: true })
      .then((data) => {
        remoteGroup = data;

        // Check the group was updated in the server
        request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
          .then((data) => {
            expect(remoteGroup.name).toEqual(data.name);
            expect(remoteGroup.description).toEqual(data.description);
            done();
          }).catch(done);
      })
      .catch(done);
  });

  it.skip('should add mappings to a group', (done) => {
    const mappings = [
      { groupName: "My groupName", connectionName: "My connectionName" }
    ];
    request.patch({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), body: mappings, headers: token(), json: true })
      .then((res) => {
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token(), json: true })
          .then((res) => {
            if (res.contains(mappings[0])) {
              done()
            } else {
              done(new Error("The just added mapping could not be found in remote."))
            }
          })
          .catch((err) => done(err.message));
      })
      .catch((err) => done(err.message));
  });

  it.skip('should get the mappings of a group', (done) => {
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token(), json: true })
      .then((res) => done())
      .catch(done);
  });

  it.skip('should remove mappings of a group', (done) => {
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token(), resolveWithFullResponse: true })
      .then((res) => {
        // TODO: Get the mappings and check
        expect(res.statusCode).toEqual(204);
        done();
      })
      .catch(done);
  });

  it('should add members to a group', (done) => {
    request.patch({ url: authzApi(`/groups/${remoteGroup._id}/members`), body: [groupMemberName], headers: token(), json: true })
      .then(() => {
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/members`), headers: token(), json: true })
          .then((data) => {
            expect(data.users.find((member) => member.user_id === groupMemberName)).toExist();
            done();
          })
          .catch(done);
      }).catch(done);;
  });

  it('should get the members of a group', (done) => {
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/members`), headers: token(), json: true })
      .then((res) => done())
      .catch(done);
  });

  it('should remove members from a group', (done) => {
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}/members`), body: [groupMemberName], headers: token(), json: true })
      .then(() => {
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/members`), headers: token(), json: true })
          .then((data) => {
            expect(data.users.find((member) => member.user_id === groupMemberName)).toNotExist();
            done();
          })
          .catch(done);
      }).catch(done);
  });

  it('should get the nested members of a group', (done) => {
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/members/nested`), headers: token(), json: true })
      .then((res) => done())
      .catch(done);
  });

  it('should add roles to a group', (done) => {
    const role = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: 'client',
      applicationId: faker.lorem.slug(),
      permissions: []
    };

    request.post({ url: authzApi('/roles'), form: role, headers: token(), json: true })
      .then((data) => {
        remoteRole = data;
        request.patch({ url: authzApi(`/groups/${remoteGroup._id}/roles`), body: [remoteRole._id], headers: token(), json: true })
          .then((res) => {
            request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles`), headers: token(), json: true })
              .then((res) => {
                expect(res.find(role => role._id === remoteRole._id)).toExist();
                done();
              }).catch(done);
          }).catch(done);
      })
      .catch(done);
  });

  it('should get the roles of a group', (done) => {
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles`), headers: token(), json: true })
      .then((res) => {
        expect(res.length).toBeGreaterThan(0);
        done();
      })
      .catch(done);
  });

  it('should delete roles from a group', (done) => {
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}/roles`), body: [remoteRole._id], headers: token(), json: true })
      .then((res) => {
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles`), headers: token(), json: true })
          .then((res) => {
            expect(res.find(role => role._id === remoteRole._id)).toNotExist();
            done();
          }).catch(done);
      }).catch(done);
  });

  it('should get the nested roles of a group', (done) => {
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles/nested`), headers: token(), json: true })
      .then((res) => done())
      .catch(done);
  });

  it('should delete a group', (done) => {
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), resolveWithFullResponse: true })
      .then((res) => {
        // Check the group was deleted in the server
        request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
          .then((data) => {
            expect(remoteGroup.name).toNotEqual(data.name);
            expect(remoteGroup.description).toNotEqual(data.description);
            done(new Error("The group still exisyarnts, it should't."));
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