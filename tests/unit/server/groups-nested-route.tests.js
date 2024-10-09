import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-nested-route', async () => {
  let server = null;
  let db = null;

  const guid = 'A56a418065aa426ca9455fd21deC0538';
  const ngid = 'B56a418065aa426ca9455fd21deC0538';
  const groupName = 'test-group';
  const nestedName = 'nest-group';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description',
    nested: [ ngid ]
  };
  const nested = {
    _id: ngid,
    name: nestedName,
    description: 'description'
  };

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.getGroups = () => Promise.resolve([ group, nested ]);
    db.getGroup = () => Promise.resolve(group);
    db.updateGroup = null;
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/nested`
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of nested groups)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return nested groups', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result[0]._id).to.be.equal(ngid);
      expect(response.result[0].name).to.be.equal(nestedName);
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete nested groups)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/nested`,
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
        url: `/api/groups/${guid}/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"value" must be an array');
    });

    it('should delete nested', async () => {
      let updatedGroup = null;
      const token = getToken('update:groups');
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/nested`,
        payload: [ ngid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(updatedGroup._id).to.be.equal(guid);
      expect(updatedGroup.name).to.be.equal(groupName);
      expect(updatedGroup.nested).to.be.a('array');
      expect(updatedGroup.nested.length).to.be.equal(0);
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update nested groups)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/nested`,
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
        url: `/api/groups/${guid}/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"value" must be an array');
    });

    it('should update nested', async () => {
      const token = getToken('update:groups');
      let updatedGroup = null;
      db.updateGroup = (id, data) => {
        updatedGroup = data;
        updatedGroup._id = id;
        return Promise.resolve();
      };

      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/nested`,
        payload: [ ngid ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(updatedGroup.name).to.be.equal(groupName);
      expect(updatedGroup._id).to.be.equal(guid);
      expect(updatedGroup.nested).to.be.a('array');
      expect(updatedGroup.nested[0]).to.be.equal(ngid);
    });
  });
});
