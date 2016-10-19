import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';

describe.only('applications-route', () => {
  let clientId = null;
  const { server } = getServerData();
  const token = getToken();

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/applications'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return list of applications', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/applications',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        if (response.result[0]) {
          clientId = response.result[0].client_id;
        }

        expect(response.result).to.be.a('array');
        cb();
      });
    });

    it('should return application data', (cb) => {
      const options = {
        method: 'GET',
        url: `/api/applications/${clientId}`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.client_id).to.be.equal(clientId);
        cb();
      });
    });
  });
});
