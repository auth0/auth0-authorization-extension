/* eslint-disable no-underscore-dangle, no-shadow */

import Promise from 'bluebird';
import request from 'request-promise';
import expect from 'expect';
import faker from 'faker';
import { getAccessToken, authzApi, token } from './utils';

let accessToken;
const groupMemberName1 = 'auth0|test-user-12345-1';
const groupMemberName2 = 'auth0|test-user-12345-2';

const parallelGroups = [ ...new Array(20) ].map(() => ({
  name: faker.lorem.slug(),
  description: faker.lorem.sentence()
}));

const createTestGroup = () => {
  const group = {
    name: faker.lorem.slug(),
    description: faker.lorem.sentence()
  };

  return request.post({
    url: authzApi('/groups'),
    form: group,
    headers: token(),
    json: true
  });
};

const createTestRole = () => {
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
    headers: token(),
    json: true
  });
};

const deleteGroupById = (groupId) =>
  request.delete({
    url: authzApi(`/groups/${groupId}`),
    headers: token(),
    json: true
  });

describe('groups', () => {
  before(() =>
    getAccessToken().then((response) => {
      accessToken = response;
      return request.post({
        url: authzApi('/configuration/import'),
        form: {},
        headers: token(),
        resolveWithFullResponse: true
      });
    })
  );

  let testGroup;
  let testRole;

  beforeEach(() =>
    createTestGroup()
      .then((newGroup) => {
        testGroup = newGroup;
        return createTestRole();
      })
      .then((newRole) => {
        testRole = newRole;
      })
  );

  afterEach(() => {
    deleteGroupById(testGroup._id);
  });

  it('should have an accessToken', () => {
    expect(accessToken).toExist();
  });

  it('should import data', () =>
    request
      .post({
        url: authzApi('/configuration/import'),
        form: {},
        headers: token(),
        resolveWithFullResponse: true
      })
      .then((response) => {
        expect(response.statusCode).toEqual(204);
      }));

  it('should export data', () =>
    request
      .get({
        url: authzApi('/configuration/export'),
        headers: token(),
        json: true
      })
      .then((data) => {
        const exportedDataKeys = Object.keys(data);
        expect(exportedDataKeys).toEqual([ 'groups', 'roles' ]);
      }));

  it('should create a new group', () =>
    createTestGroup().then((newGroup) =>
      // Check the group is stored in the server
      request
        .get({
          url: authzApi(`/groups/${newGroup._id}`),
          headers: token(),
          json: true
        })
        .then((data) => {
          expect(newGroup.name).toEqual(data.name);
          expect(newGroup.description).toEqual(data.description);
        })
    ));

  it('should create many groups in parallel', () => {
    const creationRequests = parallelGroups.map((groupData) =>
      request.post({
        url: authzApi('/groups'),
        form: groupData,
        headers: token(),
        json: true
      })
    );

    return Promise.all(creationRequests).then(() =>
      request.get({ url: authzApi('/groups'), headers: token(), json: true }).then((data) => {
        parallelGroups.forEach((group) => {
          expect(data.groups.find((g) => g.name === group.name)).toExist();
        });
      })
    );
  });

  it('should delete group', () => request
      .delete({
        url: authzApi(`/groups/${testGroup._id}`),
        headers: token(),
        resolveWithFullResponse: true
      })
      .then(() =>
        request.get({ url: authzApi(`/groups/${testGroup._id}`), headers: token(), json: true }).then(() => {
          throw new Error('Should have thrown');
        })
      )
      .catch((error) => {
        expect(error.error.statusCode).toEqual(400);
        expect(error.error.error).toEqual('Bad Request');
        expect(error.error.message).toEqual(`The record ${testGroup._id} in groups does not exist.`);
      }));

  it('should get all groups in the system', () =>
    request.get({ url: authzApi('/groups'), headers: token(), json: true }).then((data) => {
      expect(data.groups.length).toBeGreaterThan(0);
    }));

  it('should get a single group based on its unique identifier', () => {
    request
      .get({
        url: authzApi(`/groups/${testGroup._id}`),
        headers: token(),
        json: true
      })
      .then((data) => {
        expect(testGroup.name).toEqual(data.name);
        expect(testGroup.description).toEqual(data.description);
      });
  });

  it('should update a group', () => {
    const newData = {
      name: faker.lorem.slug(),
      description: faker.lorem.sentence()
    };

    return request
      .put({
        url: authzApi(`/groups/${testGroup._id}`),
        form: newData,
        headers: token(),
        json: true
      })
      .then(() => {
        // Check the group was updated in the server
        request
          .get({
            url: authzApi(`/groups/${testGroup._id}`),
            headers: token(),
            json: true
          })
          .then((updatedGroup) => {
            expect(updatedGroup.name).toEqual(newData.name);
            expect(updatedGroup.description).toEqual(newData.description);
          });
      });
  });

  describe('mappings', () => {
    beforeEach(() => {
      const mappings = [ { groupName: 'My groupName', connectionName: 'google-oauth2' } ];
      return request
        .patch({
          url: authzApi(`/groups/${testGroup._id}/mappings`),
          body: mappings,
          headers: token(),
          json: true
        })
        .then(() => {
          request
            .get({
              url: authzApi(`/groups/${testGroup._id}/mappings`),
              headers: token(),
              json: true
            })
            .then((groupMappings) => {
              expect(groupMappings.length).toEqual(1);
              expect(groupMappings[0].groupName).toEqual('My groupName');
              expect(groupMappings[0].connectionName).toEqual('google-oauth2 (google-oauth2)');
            });
        });
    });

    it('should add mappings to a group', () => {
      const mappings = [ { groupName: 'My groupName2', connectionName: 'google-oauth2' } ];
      return request
        .patch({
          url: authzApi(`/groups/${testGroup._id}/mappings`),
          body: mappings,
          headers: token(),
          json: true
        })
        .then(() => {
          request
            .get({
              url: authzApi(`/groups/${testGroup._id}/mappings`),
              headers: token(),
              json: true
            })
            .then((groupMappings) => {
              expect(groupMappings.length).toEqual(2);
              expect(groupMappings[1].groupName).toEqual('My groupName2');
              expect(groupMappings[1].connectionName).toEqual('google-oauth2 (google-oauth2)');
            });
        });
    });

    it('should get the mappings of a group', () =>
      request
        .get({
          url: authzApi(`/groups/${testGroup._id}/mappings`),
          headers: token()
        })
        .then((response) => {
          expect(response.length).toBeGreaterThan(0);
        }));

    it('should remove mappings of a group', () => {
      let mappingCount;
      return request
        .get({
          url: authzApi(`/groups/${testGroup._id}/mappings`),
          headers: token(),
          json: true
        })
        .then((mappings) => {
          mappingCount = mappings.length;
          return mappings[0];
        })
        .then((mapping) =>
          request
            .delete({
              url: authzApi(`/groups/${testGroup._id}/mappings`),
              headers: token(),
              body: [ mapping._id ],
              json: true,
              resolveWithFullResponse: true
            })
            .then((res) => {
              expect(res.statusCode).toEqual(204);
              return request
                .get({
                  url: authzApi(`/groups/${testGroup._id}/mappings`),
                  headers: token(),
                  json: true
                })
                .then((response) => {
                  expect(response.length).toEqual(mappingCount - 1);
                });
            })
        );
    });
  });

  describe('group members', () => {
    beforeEach(() => request
        .patch({
          url: authzApi(`/groups/${testGroup._id}/members`),
          body: [ groupMemberName1 ],
          headers: token(),
          json: true
        }));

    it('should add members to a group', () =>
      request
        .patch({
          url: authzApi(`/groups/${testGroup._id}/members`),
          body: [ groupMemberName2 ],
          headers: token(),
          json: true
        })
        .then(() =>
          request
            .get({
              url: authzApi(`/groups/${testGroup._id}/members`),
              headers: token(),
              json: true
            })
            .then((data) => {
              expect(data.users.find((member) => member.user_id === groupMemberName2)).toExist();
            })
        ));

    it('should get the members of a group', () =>
      request.get({
        url: authzApi(`/groups/${testGroup._id}/members`),
        headers: token(),
        json: true
      }));

    it('should remove members from a group', () =>
      request
        .delete({
          url: authzApi(`/groups/${testGroup._id}/members`),
          body: [ groupMemberName1 ],
          headers: token(),
          json: true
        })
        .then(() =>
          request
            .get({
              url: authzApi(`/groups/${testGroup._id}/members`),
              headers: token(),
              json: true
            })
            .then((data) => {
              expect(data.users.find((member) => member.user_id === groupMemberName1)).toNotExist();
            })
        ));

    it('should get the nested members of a group', () =>
      request.get({
        url: authzApi(`/groups/${testGroup._id}/members/nested`),
        headers: token(),
        json: true
      }));
  });

  describe('group roles', () => {
    beforeEach(() => request
      .patch({
        url: authzApi(`/groups/${testGroup._id}/roles`),
        body: [ testRole._id ],
        headers: token(),
        json: true
      }));

    it('should add roles to a group', () =>
    request
      .patch({
        url: authzApi(`/groups/${testGroup._id}/roles`),
        body: [ testRole._id ],
        headers: token(),
        json: true
      })
      .then(() => {
        request
          .get({
            url: authzApi(`/groups/${testGroup._id}/roles`),
            headers: token(),
            json: true
          })
          .then((res) => {
            expect(res.find((role) => role._id === testRole._id)).toExist();
          });
      }));

    it('should get the roles of a group', () =>
      request
        .get({
          url: authzApi(`/groups/${testGroup._id}/roles`),
          headers: token(),
          json: true
        })
        .then((res) => {
          expect(res.length).toBeGreaterThan(0);
        }));

    it('should delete roles from a group', () =>
      request
        .delete({
          url: authzApi(`/groups/${testGroup._id}/roles`),
          body: [ testRole._id ],
          headers: token(),
          json: true
        })
        .then(() =>
          request
            .get({
              url: authzApi(`/groups/${testGroup._id}/roles`),
              headers: token(),
              json: true
            })
            .then((res) => {
              expect(res.find((role) => role._id === testRole._id)).toNotExist();
            })
        ));

    // TODO: What is this?
    it('should get the nested roles of a group', () =>
      request.get({
        url: authzApi(`/groups/${testGroup._id}/roles/nested`),
        headers: token(),
        json: true
      }));
  });
});
