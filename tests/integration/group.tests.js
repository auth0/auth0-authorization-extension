/* eslint-disable no-underscore-dangle, no-shadow */

import Promise from 'bluebird';
import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token } from './utils';

const dataToImportExport = {};
let accessToken;
let remoteGroup;
const groupMemberName = 'auth0|test-user-12345';
let remoteRole;

const parallelGroups = [ ...new Array(20) ].map(() => ({
  name: faker.lorem.slug(),
  description: faker.lorem.sentence()
}));

describe('groups', () => {
  before(() => getAccessToken()
    .then(response => {
      accessToken = response;
      return request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true });
    })
  );

  it('should have an accessToken', () => {
    expect(accessToken).toExist();
  });

  it('should import data', () =>
    request.post({ url: authzApi('/configuration/import'), form: {}, headers: token(), resolveWithFullResponse: true })
      .then((response) => {
        expect(response.statusCode).toEqual(204);
      })
  );

  it('should export data', () =>
    request.get({ url: authzApi('/configuration/export'), headers: token(), json: true })
      .then((data) => {
        expect(data).toEqual(dataToImportExport);
      })
  );

  it('should create a new group', () => {
    const group = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    // Create the group
    return request.post({ url: authzApi('/groups'), form: group, headers: token(), json: true })
      .then((data) => {
        remoteGroup = data;

        // Check the group is stored in the server
        return request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
          .then((data) => {
            expect(remoteGroup.name).toEqual(data.name);
            expect(remoteGroup.description).toEqual(data.description);
          });
      });
  });

  // Skipped waiting to this function to be implemented in the API.
  it('should create many groups in parallel', () => {
    const creationRequests = parallelGroups.map((groupData) => request.post({
      url: authzApi('/groups'),
      form: groupData,
      headers: token(),
      json: true
    }));

    return Promise.all(creationRequests)
      .then(() => request.get({ url: authzApi('/groups'), headers: token(), json: true })
        .then((data) => {
          parallelGroups.forEach((group) => {
            expect(data.groups.find(g => g.name === group.name)).toExist();
          });
        })
      );
  });

  // Get all the groups and delete them all expect one
  it('should delete groups in parallel', () =>
    request.get({ url: authzApi('/groups'), headers: token(), json: true })
      .then((data) => {
        const groups = data.groups.splice(1);
        const deletionRequests = groups.map((group) => request.delete({
          url: authzApi(`/groups/${group._id}`),
          headers: token(),
          resolveWithFullResponse: true
        }));

        // Let's fetch all the groups and find.
        return Promise.all(deletionRequests)
          .then(() => 
            request.get({ url: authzApi('/groups'), headers: token(), json: true })
              .then((data) => {
                data.groups.forEach((group) => {
                  expect(parallelGroups.find(g => g._id === group._id)).toNotExist();
                });
              })
          );
      })
  );

  it('should get all groups in the system', () =>
    request.get({ url: authzApi('/groups'), headers: token(), json: true })
      .then((data) => {
        expect(data.groups.length).toBeGreaterThan(0);
      })
  );

  it('should get a single group based on its unique identifier', () =>
    request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
      .then((data) => {
        expect(remoteGroup.name).toEqual(data.name);
        expect(remoteGroup.description).toEqual(data.description);
      })
  );

  it('should update a group', () => {
    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    return request.put({ url: authzApi(`/groups/${remoteGroup._id}`), form: newData, headers: token(), json: true })
      .then((data) => {
        remoteGroup = data;

        // Check the group was updated in the server
        request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
          .then((data) => {
            expect(remoteGroup.name).toEqual(data.name);
            expect(remoteGroup.description).toEqual(data.description);
          });
      });
  });

  it('should add mappings to a group', () => {
    const mappings = [
      { groupName: 'My groupName', connectionName: 'google-oauth2' }
    ];
    return request.patch({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), body: mappings, headers: token(), json: true })
      .then(() => {
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token(), json: true })
          .then((groupMappings) => {
            expect(groupMappings.length).toEqual(1);
            expect(groupMappings[0].groupName).toEqual('My groupName');
            expect(groupMappings[0].connectionName).toEqual('google-oauth2 (google-oauth2)');
          });
      });
  });

  it('should get the mappings of a group', () => (
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token() })
      .then((response) => {
        expect(response.length).toBeGreaterThan(0);
      })
  ));

  it('should remove mappings of a group', () => {
    let mappingCount;
    return request.get({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token(), json: true })
      .then((mappings) => {
        mappingCount = mappings.length;
        return mappings[0];
      })
      .then((mapping) => request.delete({
        url: authzApi(`/groups/${remoteGroup._id}/mappings`),
        headers: token(),
        body: [ mapping._id ],
        json: true,
        resolveWithFullResponse: true
      })
      .then((res) => {
        expect(res.statusCode).toEqual(204);
        return request.get({ url: authzApi(`/groups/${remoteGroup._id}/mappings`), headers: token(), json: true })
          .then((response) => {
            expect(response.length).toEqual(mappingCount - 1);
          });
      }));
  });

  it('should add members to a group', () =>
    request.patch({ url: authzApi(`/groups/${remoteGroup._id}/members`), body: [ groupMemberName ], headers: token(), json: true })
      .then(() =>
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/members`), headers: token(), json: true })
          .then((data) => {
            expect(data.users.find((member) => member.user_id === groupMemberName)).toExist();
          })
      )
  );

  it('should get the members of a group', () =>
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/members`), headers: token(), json: true })
  );

  it('should remove members from a group', () =>
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}/members`), body: [ groupMemberName ], headers: token(), json: true })
      .then(() =>
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/members`), headers: token(), json: true })
          .then((data) => {
            expect(data.users.find((member) => member.user_id === groupMemberName)).toNotExist();
          })
      )
  );

  it('should get the nested members of a group', () =>
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/members/nested`), headers: token(), json: true })
  );

  it('should add roles to a group', () => {
    const role = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence(),
      applicationType: 'client',
      applicationId: faker.lorem.slug(),
      permissions: []
    };

    return request.post({ url: authzApi('/roles'), form: role, headers: token(), json: true })
      .then((data) => {
        remoteRole = data;
        return request.patch({ url: authzApi(`/groups/${remoteGroup._id}/roles`), body: [ remoteRole._id ], headers: token(), json: true })
          .then(() =>
            request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles`), headers: token(), json: true })
              .then((res) => {
                expect(res.find(role => role._id === remoteRole._id)).toExist();
              })
          );
      });
  });

  it('should get the roles of a group', () =>
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles`), headers: token(), json: true })
      .then((res) => {
        expect(res.length).toBeGreaterThan(0);
      })
  );

  it('should delete roles from a group', () =>
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}/roles`), body: [ remoteRole._id ], headers: token(), json: true })
      .then(() =>
        request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles`), headers: token(), json: true })
          .then((res) => {
            expect(res.find(role => role._id === remoteRole._id)).toNotExist();
          })
      )
  );

  it('should get the nested roles of a group', () =>
    request.get({ url: authzApi(`/groups/${remoteGroup._id}/roles/nested`), headers: token(), json: true })
  );

  it('should delete a group', (done) => {
    request.delete({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), resolveWithFullResponse: true })
      .then(() => {
        // Check the group was deleted in the server
        request.get({ url: authzApi(`/groups/${remoteGroup._id}`), headers: token(), json: true })
          .then((data) => {
            expect(remoteGroup.name).toNotEqual(data.name);
            expect(remoteGroup.description).toNotEqual(data.description);
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
