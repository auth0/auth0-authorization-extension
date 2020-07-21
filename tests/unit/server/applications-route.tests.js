import { expect } from 'chai';
import { getServerData } from '../server';
import * as auth0 from '../mocks/auth0';
import { getToken } from '../mocks/tokens';

describe.only('applications-route', () => {
  const { server } = getServerData();
  const applications = [
    {
      name: 'GlobalApp',
      global: true,
      client_id: '0'
    },
    {
      name: 'NonIA',
      global: false,
      app_type: 'non_interactive',
      client_id: '1'
    },
    {
      name: 'SPA',
      global: false,
      app_type: 'spa',
      client_id: '2'
    },
    {
      name: 'GlobalApp',
      global: false,
      client_id: '3'
    }
  ];

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

    it.only('should return 403 if scope is missing (list of apps)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/applications',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return list of applications', (cb) => {
      const token = getToken('read:applications');
      auth0.get('/api/v2/clients', applications);
      const options = {
        method: 'GET',
        url: '/api/applications',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result).to.be.a('array');
        expect(response.result.length).to.equal(1);
        expect(response.result[0].app_type).to.equal('spa');
        cb();
      });
    });

    it('should return 403 if scope is missing (single app)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/applications/1',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return application data', (cb) => {
      const token = getToken('read:applications');
      auth0.get('/api/v2/clients/1', applications[1]);
      const options = {
        method: 'GET',
        url: '/api/applications/1',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.client_id).to.be.equal('1');
        cb();
      });
    });
  });
});
