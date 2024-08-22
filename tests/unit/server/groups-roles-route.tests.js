import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-members-route', async () => {
  let server = null;
  let db = null;

  const guid = 'C56a418065aa426ca9455fd21deC0538';
  const roleId = '38d5f9a6c0dc4f6381ac746f87663727';
  const groupName = 'test-group';
  const group = {
    _id: guid,
    name: groupName,
    description: 'description',
    roles: [ roleId ]
  };
  const role = {
    _id: roleId,
    name: 'role',
    description: 'description',
    permissions: []
  };
  let updatedGroup = null;

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.getGroup = () => Promise.resolve(group);
    db.getRoles = () => Promise.resolve([ role ]);
    db.updateGroup = (id, data) => {
      updatedGroup = data;
      updatedGroup._id = id;
      return Promise.resolve();
    };
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles`
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of roles)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return roles', async () => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(response.result).to.be.a('array');
      expect(response.result[0]._id).to.be.equal(roleId);
    });

    it('should return 403 if scope is missing (list of nested roles)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return nested roles', async () => {
      const token = getToken('read:groups');
      db.getGroups = () => Promise.resolve([ group ]);
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(response.result).to.be.a('array');
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete roles)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/roles`,
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
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"value" must be an array');
    });

    it('should delete roles', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/roles`,
        payload: [ roleId ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(updatedGroup._id).to.be.equal(guid);
      expect(updatedGroup.name).to.be.equal(groupName);
      expect(updatedGroup.roles).to.be.a('array');
      expect(updatedGroup.roles.length).to.be.equal(0);
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update roles)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/roles`,
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
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal('"value" must be an array');
    });

    it('should update roles', async () => {
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/roles`,
        payload: [ roleId ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(updatedGroup.name).to.be.equal(groupName);
      expect(updatedGroup._id).to.be.equal(guid);
      expect(updatedGroup.roles).to.be.a('array');
      expect(updatedGroup.roles[0]).to.be.equal(roleId);
    });
  });
});
