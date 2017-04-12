import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';
import config from '../../../server/lib/config';

describe('permissions-route', () => {
  const { db, server } = getServerData();
  const guid = 'A56a418065aa426ca9455fd21deC0538';
  const permissionName = 'test-permission';
  const permission = {
    name: permissionName,
    description: 'description',
    applicationType: 'client',
    applicationId: config('AUTH0_CLIENT_ID'),
    _id: guid
  };

  before((done) => {
    db.canChange = () => Promise.resolve();
    db.getPermissions = () => Promise.resolve([ permission ]);
    db.getPermission = () => Promise.resolve(permission);
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/permissions'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (list of permissions)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return list of permissions', (cb) => {
      const token = getToken('read:permissions');
      const options = {
        method: 'GET',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.total).to.be.equal(1);
        expect(response.result.permissions).to.be.a('array');
        expect(response.result.permissions[0]._id).to.be.equal(guid);
        expect(response.result.permissions[0].name).to.be.equal(permissionName);
        cb();
      });
    });

    it('should return 403 if scope is missing (single permission)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return permission data', (cb) => {
      const token = getToken('read:permissions');
      const options = {
        method: 'GET',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result._id).to.be.equal(guid);
        expect(response.result.name).to.be.equal(permissionName);
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete permission)', (cb) => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should delete permission', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(deletedId).to.be.equal(guid);
        cb();
      });
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (create permission)', (cb) => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
      const token = getToken('create:permissions');
      const options = {
        method: 'POST',
        url: '/api/permissions',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"value" must be an object');
        cb();
      });
    });

    it('should create permission', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result.name).to.be.equal(payload.name);
        cb();
      });
    });
  });

  describe('#put', () => {
    it('should return 403 if scope is missing (update permission)', (cb) => {
      const token = getToken();
      const options = {
        method: 'PUT',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
      const token = getToken('update:permissions');
      const options = {
        method: 'PUT',
        url: `/api/permissions/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"value" must be an object');
        cb();
      });
    });

    it('should update permission', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(updatedPermission.name).to.be.equal(payload.name);
        expect(updatedPermission._id).to.be.equal(guid);
        cb();
      });
    });
  });
});
