import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-groups-route', () => {
  const { db, server } = getServerData();
  const group = {
    _id: 'A56a418065aa426ca9455fd21deC0538',
    name: 'test-group',
    description: 'description',
    members: [ 'userId' ]
  };

  before((done) => {
    db.getGroups = () => Promise.resolve([ group ]);
    db.getGroup = () => Promise.resolve(group);
    db.updateGroup = (id, data) => {
      group.id = id;
      group.members = data.members;
      return Promise.resolve();
    };
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (list of groups)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return user groups', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(group._id);
        expect(response.result[0].name).to.be.equal(group.name);
        cb();
      });
    });

    it('should return empty array', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/test-auth|no-such-user/groups',
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

    it('should return 403 if scope is missing (list of calculated groups)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups/calculate',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return calculated groups', (cb) => {
      const token = getToken('read:groups');
      const options = {
        method: 'GET',
        url: '/api/users/userId/groups/calculate',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result[0]._id).to.be.equal(group._id);
        expect(response.result[0].name).to.be.equal(group.name);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update groups)', (cb) => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should add user to groups', (cb) => {
      const token = getToken('update:groups');
      const options = {
        method: 'PATCH',
        url: '/api/users/userId/groups',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: [ group._id ]
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        expect(group.id).to.be.equal(group._id);
        expect(group.members[0]).to.be.equal('userId');
        cb();
      });
    });
  });
});
