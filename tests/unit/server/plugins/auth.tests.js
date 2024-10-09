import { expect } from 'chai';
import * as auth0 from '../../mocks/auth0';
import { getServerData } from '../../server';
import { getToken, getUserToken, getApiToken, getAdminTokenWithoutAccessToken } from '../../mocks/tokens';

describe('auth', async () => {
  let server = null;
  let db = null;

  const groupName = 'developers';
  const guid = 'C56a418065aa426ca9455fd21deC1112';
  const groups = [
    {
      _id: 'C56a418065aa426ca9455fd21deC1110',
      name: 'employees',
      roles: [ 'r1', 'r2' ],
      nested: [ 'C56a418065aa426ca9455fd21deC1111' ]
    },
    {
      _id: 'C56a418065aa426ca9455fd21deC1111',
      name: 'it',
      roles: [ 'r3' ],
      nested: [ guid ]
    },
    { _id: guid, name: groupName, roles: [ 'r1' ], nested: [ '', '' ] }
  ];

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;
    db.getGroups = () => Promise.resolve(groups);
  });

  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/connections'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list connections)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return 401 if the access token was not issued to a client', async () => {
      const token = getUserToken('read:connections');
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 401 if the admin token does not contain an access token', async () => {
      const token = getAdminTokenWithoutAccessToken();
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 401 if the api token does contain wrong gty', async () => {
      const token = getApiToken('wrong-gty');
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 401 if the api token does contain wrong sub', async () => {
      const token = getApiToken('client-credentials');
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should work with correct api token (with gty)', async () => {
      const token = getApiToken('client-credentials', 'clients', [ 'read:groups' ]);
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
    });

    it('should work with correct api token (without gty)', async () => {
      const token = getApiToken(null, 'clients', [ 'read:groups' ]);
      const options = {
        method: 'GET',
        url: '/api/groups',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.be.equal(200);
    });

    it('should execute the route is the access token is valid', async () => {
      const token = getToken('read:connections');
      auth0.get('/api/v2/connections', [ { id: 'cid', name: 'my-connection' } ]);
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result.length).to.equal(1);
      expect(response.result[0].id).to.equal('cid');
    });
  });
});
