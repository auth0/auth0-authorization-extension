import nock from 'nock';
import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('users-route', async () => {
  let server = null;

  const user = {
    email: 'user@example.com',
    email_verified: true,
    user_id: 'userId',
    nickname: 'user',
    identities: [
      {
        user_id: 'userId',
        provider: 'auth0',
        connection: 'Username-Password-Authentication',
        isSocial: false
      }
    ],
    name: 'user@example.com'
  };

  const user2 = {
    email: 'alice@example.com',
    email_verified: true,
    user_id: 'aliceUserId',
    nickname: 'Alice',
    identities: [
      {
        user_id: 'aliceUserId',
        provider: 'auth0',
        connection: 'Username-Password-Authentication',
        isSocial: false
      }
    ],
    name: 'alice@example.com'
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

    it('should return a filtered list of users', async () => {
      const token = getToken('read:users');

      // test that api2 is called with `q=alice` query param
      nock('https://foo.auth0.local')
        .get('/api/v2/users')
        .query({
          "sort":"last_login:-1",
          "q":"alice",
          "per_page":"100",
          "page":"0",
          "include_totals":"true",
          "fields":"user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked",
          "search_engine":"v3",
        })
        .times(1)
        .reply(200, { start: 0, users: [ user2 ] });
        
      const options = {
        method: 'GET',
        url: '/api/users?q=alice',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('object');
      expect(response.result.users).to.be.a('array');
      expect(response.result.start).to.be.equal(0);
      expect(response.result.users.length).to.be.equal(1);
      expect(response.result.users[0].name).to.be.equal(user2.name);
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
