import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-route', () => {
  const { server } = getServerData();
  const token = getToken();
  let userId = null;

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/users'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return list of users', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/users',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result.users).to.be.a('array');
        expect(response.result.start).to.be.equal(0);
        expect(response.result.users.length).to.be.equal(response.result.length);

        userId = response.result.users[0].user_id;
        cb();
      });
    });

    it('should return user data', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/users/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('object');
        expect(response.result.user_id).to.be.equal(userId);
        cb();
      });
    });

    it('should return bad request error', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/users/test-auth|no-such-user',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(400);
        expect(response.result.error).to.be.equal('Bad Request');
        cb();
      });
    });
  });
});
