import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-groups-route', async () => {
  let server = null;
  let db = null;

  const group = {
    _id: 'A56a418065aa426ca9455fd21deC0538',
    name: 'test-group',
    roles: [ 'C56a418065aa426ca9455fd21deC0538' ],
    members: [ 'userId' ]
  };
  const emptyGroup = {
    _id: 'C56a418065aa426ca9455fd21deC0538',
    name: 'test-group-2'
  };
  const role = {
    _id: 'B56a418065aa426ca9455fd21deC0538',
    name: 'test-role',
    users: [ 'userId' ]
  };
  const emptyRole = {
    _id: 'D56a418065aa426ca9455fd21deC0538',
    name: 'test-role-2'
  };
  const groupRole = {
    _id: 'C56a418065aa426ca9455fd21deC0538',
    name: 'group-role'
  };


  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.getGroups = () => Promise.resolve([ emptyGroup, group ]);
    db.getRoles = () => Promise.resolve([ role, emptyRole, groupRole ]);
    db.getRole = () => Promise.resolve(groupRole);
    db.updateRole = (id, data) => {
      groupRole.id = id;
      groupRole.users = data.users;
      return Promise.resolve();
    };
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/users/userId/roles'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of roles)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return user roles', async () => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result[0]._id).to.be.equal(role._id);
      expect(response.result[0].name).to.be.equal(role.name);
    });

    it('should return 403 if scope is missing (list of nested roles)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId/roles/calculate',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return user roles of groups', async () => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: '/api/users/userId/roles/calculate',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result[0]._id).to.be.equal(groupRole._id);
      expect(response.result[0].name).to.be.equal(groupRole.name);
      expect(response.result[1]._id).to.be.equal(role._id);
      expect(response.result[1].name).to.be.equal(role.name);
    });

    it('should return empty array', async () => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: '/api/users/test-auth|no-such-user/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result.length).to.be.equal(0);
    });
  });

  describe('#patch', () => {
    beforeEach(() => {
      groupRole.users = null;
    });

    it('should return 403 if scope is missing (update roles)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should add user to role', async () => {
      const token = getToken('update:roles');
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ groupRole._id ]
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
      expect(groupRole.id).to.be.equal(groupRole._id);
      expect(groupRole.users[0]).to.be.equal('userId');
    });

    it('should add user to role by role name', async () => {
      const token = getToken('update:roles');
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ groupRole.name ]
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
      expect(groupRole.id).to.be.equal(groupRole._id);
      expect(groupRole.users[0]).to.be.equal('userId');
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete roles)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should remove user from role', async () => {
      const token = getToken('update:roles');
      const options = {
        method: 'DELETE',
        url: '/api/users/userId/roles',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ groupRole._id ]
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
      expect(groupRole.id).to.be.equal(groupRole._id);
      expect(groupRole.users.length).to.be.equal(0);
    });
  });
});
