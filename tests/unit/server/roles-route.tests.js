import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';
import config from '../../../server/lib/config';

describe('roles-route', async () => {
  let server = null;
  let db = null;

  const guid = 'A56a418065aa426ca9455fd21deC0538';
  const roleName = 'test-role';
  const role = {
    name: roleName,
    description: 'description',
    applicationType: 'client',
    applicationId: config('AUTH0_CLIENT_ID'),
    _id: guid
  };
  const permission = {
    name: 'test-permission',
    description: 'description',
    applicationType: 'client',
    applicationId: config('AUTH0_CLIENT_ID'),
    _id: 'B56a418065aa426ca9455fd21deC0538'
  };

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.canChange = () => Promise.resolve();
    db.getPermissions = () => Promise.resolve([ permission ]);
    db.getRoles = () => Promise.resolve([ role ]);
    db.getRole = () => Promise.resolve(role);
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/roles'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of roles)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return list of roles', async () => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.total).to.be.equal(1);
      expect(response.result.roles).to.be.a('array');
      expect(response.result.roles[0]._id).to.be.equal(guid);
      expect(response.result.roles[0].name).to.be.equal(roleName);
    });

    it('should return 403 if scope is missing (single role)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return role data', async () => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result._id).to.be.equal(guid);
      expect(response.result.name).to.be.equal(roleName);
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete role)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should delete role', async () => {
      const token = getToken('delete:roles');
      let deletedId = null;

      db.deleteRole = (id) => {
        deletedId = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(204);
      expect(deletedId).to.be.equal(guid);
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (create role)', async () => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('create:roles');
      const options = {
        method: 'POST',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal(
        '"value" must be of type object'
      );
    });

    it('should create role', async () => {
      const token = getToken('create:roles');
      const payload = {
        name: 'new-role',
        description: 'description',
        applicationType: 'client',
        applicationId: config('AUTH0_CLIENT_ID')
      };

      db.createRole = (data) => Promise.resolve(data);

      const options = {
        method: 'POST',
        url: '/api/roles',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(response.result.name).to.be.equal(payload.name);
    });
  });

  describe('#put', () => {
    it('should return 403 if scope is missing (update role)', async () => {
      const token = getToken();
      const options = {
        method: 'PUT',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:roles');
      const options = {
        method: 'PUT',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.message).to.be.equal(
        '"value" must be of type object'
      );
    });

    it('should update role', async () => {
      const token = getToken('update:roles');
      let updatedRole = null;
      db.updateRole = (id, data) => {
        updatedRole = data;
        updatedRole._id = id;
        return Promise.resolve(updatedRole);
      };

      const payload = {
        name: `${roleName}-updated`,
        description: 'description',
        applicationType: 'client',
        applicationId: config('AUTH0_CLIENT_ID')
      };

      const options = {
        method: 'PUT',
        url: `/api/roles/${guid}`,
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(updatedRole.name).to.be.equal(payload.name);
      expect(updatedRole._id).to.be.equal(guid);
    });
  });
});
