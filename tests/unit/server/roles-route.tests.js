import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';
import config from '../../../server/lib/config';

describe('roles-route', () => {
  const { db, server } = getServerData();
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

  before((done) => {
    db.canChange = () => Promise.resolve();
    db.getPermissions = () => Promise.resolve([ permission ]);
    db.getRoles = () => Promise.resolve([ role ]);
    db.getRole = () => Promise.resolve(role);
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/roles'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (list of roles)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'GET',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return list of roles', (cb) => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.total).to.be.equal(1);
        expect(response.result.roles).to.be.a('array');
        expect(response.result.roles[0]._id).to.be.equal(guid);
        expect(response.result.roles[0].name).to.be.equal(roleName);
        cb();
      });
    });

    it('should return 403 if scope is missing (single role)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'GET',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return role data', (cb) => {
      const token = getToken('read:roles');
      const options = {
        method: 'GET',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result._id).to.be.equal(guid);
        expect(response.result.name).to.be.equal(roleName);
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete role)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'DELETE',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should delete role', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(deletedId).to.be.equal(guid);
        cb();
      });
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (create role)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'POST',
        url: '/api/roles',
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
      const token = getToken('create:roles');
      const options = {
        method: 'POST',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal(
          '"value" must be an object'
        );
        cb();
      });
    });

    it('should create role', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result.name).to.be.equal(payload.name);
        cb();
      });
    });
  });

  describe('#put', () => {
    it('should return 403 if scope is missing (update role)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'PUT',
        url: `/api/roles/${guid}`,
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
      const token = getToken('update:roles');
      const options = {
        method: 'PUT',
        url: `/api/roles/${guid}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal(
          '"value" must be an object'
        );
        cb();
      });
    });

    it('should update role', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(updatedRole.name).to.be.equal(payload.name);
        expect(updatedRole._id).to.be.equal(guid);
        cb();
      });
    });
  });
});
