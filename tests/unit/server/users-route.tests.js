import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-route', async () => {
  let server = null;

  const user = {
    email: 'user@exampple.com',
    email_verified: true,
    user_id: 'userId',
    nickname: 'user',
    identities: [
      {
        user_id: 'userId',
        provider: 'auth0',
        connection: 'Username-Password-Authentication',
        isSocia: false
      }
    ],
    name: 'user@exampple.com'
  };

  before(async () => {
    const result = await getServerData();
    server = result.server;
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/users'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of users)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return list of users', async () => {
      const token = getToken('read:users');
      auth0.get('/api/v2/users', { start: 0, users: [ user ] });
      const options = {
        method: 'GET',
        url: '/api/users',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result.users).to.be.a('array');
      expect(response.result.start).to.be.equal(0);
      expect(response.result.users.length).to.be.equal(1);
      expect(response.result.users[0].name).to.be.equal(user.name);
    });

    it('should return 403 if scope is missing (single user)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/users/userId',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return user data', async () => {
      const token = getToken('read:users');
      auth0.get('/api/v2/users/userId', user);
      const options = {
        method: 'GET',
        url: '/api/users/userId',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result.name).to.be.equal(user.name);
      expect(response.result.user_id).to.be.equal(user.user_id);
    });

    it('should return bad request error', async () => {
      const token = getToken('read:users');
      auth0.get('/api/v2/users/no-such-user', {}, 400);
      const options = {
        method: 'GET',
        url: '/api/users/no-such-user',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(400);
      expect(response.result.error).to.be.equal('Bad Request');
    });
  });
});
