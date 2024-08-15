import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('groups-members-route', () => {
  const { db, server } = getServerData();
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

  before((done) => {
    db.getGroup = () => Promise.resolve(group);
    db.getRoles = () => Promise.resolve([ role ]);
    db.updateGroup = (id, data) => {
      updatedGroup = data;
      updatedGroup._id = id;
      return Promise.resolve();
    };
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles`
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
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return roles', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(roleId);
        cb();
      });
    });

    it('should return 403 if scope is missing (list of nested roles)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return nested roles', (cb) => {
      const token = getToken('read:groups');
      db.getGroups = () => Promise.resolve([ group ]);
      const options = {
        method: 'GET',
        url: `/api/groups/${guid}/roles/nested`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        expect(response.result).to.be.a('array');
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (delete roles)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/roles`,
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
      const token = getToken('update:groups');
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"value" must be an array');
        cb();
      });
    });

    it('should delete roles', (cb) => {
      const token = getToken('update:groups');
      const options = {
        method: 'DELETE',
        url: `/api/groups/${guid}/roles`,
        payload: [ roleId ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup.roles).to.be.a('array');
        expect(updatedGroup.roles.length).to.be.equal(0);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update roles)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/roles`,
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
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.message).to.be.equal('"value" must be an array');
        cb();
      });
    });

    it('should update roles', (cb) => {
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: `/api/groups/${guid}/roles`,
        payload: [ roleId ],
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(204);
        expect(updatedGroup.name).to.be.equal(groupName);
        expect(updatedGroup._id).to.be.equal(guid);
        expect(updatedGroup.roles).to.be.a('array');
        expect(updatedGroup.roles[0]).to.be.equal(roleId);
        cb();
      });
    });
  });
});
