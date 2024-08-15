import { expect } from 'chai';
import * as auth0 from '../../mocks/auth0';
import { getServerData } from '../../server';
import { getToken, getUserToken, getApiToken, getAdminTokenWithoutAccessToken } from '../../mocks/tokens';

describe('auth', () => {
  const { server } = getServerData();

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/connections'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (list connections)', (cb) => {
      const token = gettoken(accessToken);
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return 401 if the access token was not issued to a client', (cb) => {
      const token = getUserToken('read:connections');
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 401 if the admin token does not contain an access token', (cb) => {
      const token = getAdminTokenWithoutAccesstoken(accessToken);
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 401 if the api token does contain wrong gty', (cb) => {
      const token = getApiToken('wrong-gty');
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 401 if the api token does contain wrong sub', (cb) => {
      const token = getApiToken('client-credentials');
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should work with correct api token (with gty)', (cb) => {
      const token = getApiToken('client-credentials', 'clients', [ 'read:groups' ]);
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        cb();
      });
    });

    it('should work with correct api token (without gty)', (cb) => {
      const token = getApiToken(null, 'clients', [ 'read:groups' ]);
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.be.equal(200);
        cb();
      });
    });

    it('should execute the route is the access token is valid', (cb) => {
      const token = getToken('read:connections');
      auth0.get('/api/v2/connections', [ { id: 'cid', name: 'my-connection' } ]);
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result.length).to.equal(1);
        expect(response.result[0].id).to.equal('cid');
        cb();
      });
    });
  });
});
