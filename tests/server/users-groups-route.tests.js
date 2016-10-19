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
    description: 'description'
  };

  before((done) => {
    db.getGroups = () => Promise.resolve([ group ]);
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
      group.members = [ userId ];
      done();
    });
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/users/${userId}/groups`
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return user groups', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/users/${userId}/groups`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        console.log(response.result);
        expect(response.result[0]._id).to.be.equal(group._id);
        expect(response.result[0].name).to.be.equal(group.name);
        cb();
      });
    });

    it('should return empty array', (cb) => {
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
  });
});
