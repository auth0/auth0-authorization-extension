import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';
import config from '../../../server/lib/config';

describe('permissions-route', async () => {
  let server = null;
  let db = null;

  const guid = 'A56a418065aa426ca9455fd21deC0538';
  const permissionName = 'test-permission';
  const permission = {
    name: permissionName,
    description: 'description',
    applicationType: 'client',
    applicationId: config('AUTH0_CLIENT_ID'),
    _id: guid
  };

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.canChange = () => Promise.resolve();
    db.getPermissions = () => Promise.resolve([ permission ]);
    db.getPermission = () => Promise.resolve(permission);
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/permissions'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of permissions)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return list of permissions', async () => {
      const token = getToken('read:permissions');
      const options = {
        method: 'GET',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.total).to.be.equal(1);
      expect(response.result.permissions).to.be.a('array');
      expect(response.result.permissions[0]._id).to.be.equal(guid);
      expect(response.result.permissions[0].name).to.be.equal(permissionName);
    });

    it('should return 403 if scope is missing (single permission)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return permission data', async () => {
      const token = getToken('read:permissions');
      const options = {
        method: 'GET',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result._id).to.be.equal(guid);
      expect(response.result.name).to.be.equal(permissionName);
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete permission)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should delete permission', async () => {
      let deletedId = null;
      const token = getToken('delete:permissions');
      db.deletePermission = (id) => {
        deletedId = id;
        return Promise.resolve();
      };

      const options = {
        method: 'DELETE',
        url: `/api/permissions/${guid}`,
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
    it('should return 403 if scope is missing (create permission)', async () => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('create:permissions');
      const options = {
        method: 'POST',
        url: '/api/permissions',
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

    it('should create permission', async () => {
      const token = getToken('create:permissions');
      const payload = {
        name: 'new-permission',
        description: 'description',
        applicationType: 'client',
        applicationId: config('AUTH0_CLIENT_ID')
      };

      db.createPermission = (data) => Promise.resolve(data);

      const options = {
        method: 'POST',
        url: '/api/permissions',
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
    it('should return 403 if scope is missing (update permission)', async () => {
      const token = getToken();
      const options = {
        method: 'PUT',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:permissions');
      const options = {
        method: 'PUT',
        url: `/api/permissions/${guid}`,
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

    it('should update permission', async () => {
      const token = getToken('update:permissions');
      let updatedPermission = null;
      db.updatePermission = (id, data) => {
        updatedPermission = data;
        updatedPermission._id = id;
        return Promise.resolve(updatedPermission);
      };

      const payload = {
        name: `${permissionName}-updated`,
        description: 'description',
        applicationType: 'client',
        applicationId: config('AUTH0_CLIENT_ID')
      };

      const options = {
        method: 'PUT',
        url: `/api/permissions/${guid}`,
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
      expect(updatedPermission.name).to.be.equal(payload.name);
      expect(updatedPermission._id).to.be.equal(guid);
    });
  });
});
