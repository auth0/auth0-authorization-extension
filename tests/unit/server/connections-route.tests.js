import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('connections-route', async () => {
  let server = null;

  before(async () => {
    const result = await getServerData();
    server = result.server;
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

    it('should return list of connections', async () => {
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
