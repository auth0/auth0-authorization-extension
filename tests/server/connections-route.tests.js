import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';

describe.only('connections-route', () => {
  const { server } = getServerData();
  const token = getToken();

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

    it('should return list of connections', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/connections',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        cb();
      });
    });
  });
});
