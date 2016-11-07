import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';
import config from '../../server/lib/config';

describe('roles-route', () => {
  const { db, server } = getServerData();
  const token = getToken();
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
    db.canTouchRecord = () => Promise.resolve();
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

    it('should return list of roles', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(guid);
        expect(response.result[0].name).to.be.equal(roleName);
        cb();
      });
    });

    it('should return role data', (cb) => {
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
    it('should delete role', (cb) => {
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
    it('should return validation error', (cb) => {
      const options = {
        method: 'POST',
        url: '/api/roles',
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

    it('should create role', (cb) => {
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
    it('should return validation error', (cb) => {
      const options = {
        method: 'PUT',
        url: `/api/roles/${guid}`,
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

    it('should update role', (cb) => {
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
