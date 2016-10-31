import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';

describe('users-groups-route', () => {
  let userId = null;
  const { db, server } = getServerData();
  const token = getToken();
  const group = {
    _id: 'A56a418065aa426ca9455fd21deC0538',
    name: 'test-group',
    roles: [ 'C56a418065aa426ca9455fd21deC0538' ]
  };
  const role = {
    _id: 'B56a418065aa426ca9455fd21deC0538',
    name: 'test-role'
  };
  const groupRole = {
    _id: 'C56a418065aa426ca9455fd21deC0538',
    name: 'group-role'
  };

  before((done) => {
    db.getGroups = () => Promise.resolve([ group ]);
    db.getRoles = () => Promise.resolve([ role, groupRole ]);
    db.getRole = () => Promise.resolve(groupRole);
    db.updateRole = (id, data) => {
      groupRole.id = id;
      groupRole.users = data.users;
      return Promise.resolve();
    };
    done();
  });

  before((done) => {
    const options = {
      method: 'GET',
      url: '/api/users',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    server.inject(options, (response) => {
      userId = response.result.users[0].user_id;
      role.users = [ userId ];
      group.members = [ userId ];
      done();
    });
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/users/${userId}/roles`
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return user roles', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/users/${userId}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(role._id);
        expect(response.result[0].name).to.be.equal(role.name);
        cb();
      });
    });

    it('should return user roles of groups', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/users/${userId}/roles/groups`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(groupRole._id);
        expect(response.result[0].name).to.be.equal(groupRole.name);
        cb();
      });
    });

    it('should return empty array', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/users/test-auth|no-such-user/roles',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result.length).to.be.equal(0);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should add user to role', (cb) => {
      const options = {
        method: 'PATCH',
        url: `/api/users/${userId}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ groupRole._id ]
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        expect(groupRole.id).to.be.equal(groupRole._id);
        expect(groupRole.users[0]).to.be.equal(userId);
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should remove user from role', (cb) => {
      const options = {
        method: 'DELETE',
        url: `/api/users/${userId}/roles`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ groupRole._id ]
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        expect(groupRole.id).to.be.equal(groupRole._id);
        expect(groupRole.users.length).to.be.equal(0);
        cb();
      });
    });
  });
});
