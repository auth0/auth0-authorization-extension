import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-members-route', async () => {
  let server = null;
  let db = null;

  const guid = 'C56a418065aa426ca9455fd21deC0538';
  const pgid = 'C56a418065aa426ca9455fd21deC0530';
  const ngid = 'C56a418065aa426ca9455fd21deC0539';
  const uid = 'auth0|some_user_id';
  const nuid = 'auth0|some_nested_user_id';
  const groupName = 'test-group';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description',
    members: [ uid, 'undefined' ]
  };
  const parentGroup = {
    _id: pgid,
    name: groupName,
    description: 'description',
    members: [ uid ],
    nested: [ ngid ]
  };
  const nestedGroup = {
    _id: ngid,
    name: groupName,
    description: 'description',
    members: [ nuid ]
  };

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.getGroup = () => Promise.resolve(group);
    db.getGroups = () => Promise.resolve([ group, parentGroup, nestedGroup ]);
    db.updateGroup = null;
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/members`
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of members)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return members', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(response.result.users).to.be.a('array');
      expect(response.result.users[0].user_id).to.be.equal(uid);
      expect(response.result.users[1].user_id).to.be.equal('undefined');
      expect(response.result.users[1].name).to.be.equal('<Error: APIError>');
      expect(response.result.total).to.be.equal(2);
    });

    it('should return nested members', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${pgid}/members/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(response.result.nested).to.be.a('array');
      expect(response.result.total).to.equal(2);
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete members)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"value" must be an array');
    });

    it('should delete members', async () => {
      let updatedGroup = null;
      const token = getToken('update:groups');
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/members`,
        payload: [ uid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(updatedGroup._id).to.be.equal(guid);
      expect(updatedGroup.name).to.be.equal(groupName);
      expect(updatedGroup.members).to.be.a('array');
      expect(updatedGroup.members.length).to.be.equal(0);
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (add members)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/members`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"value" must be an array');
    });

    it('should update members', async () => {
      const token = getToken('update:groups');
      let updatedGroup = null;
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const newMember = 'auth0|some_new_user_id';
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/members`,
        payload: [ newMember ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(updatedGroup.name).to.be.equal(groupName);
      expect(updatedGroup._id).to.be.equal(guid);
      expect(updatedGroup.members).to.be.a('array');
      expect(updatedGroup.members[0]).to.be.equal(newMember);
    });
  });
});
