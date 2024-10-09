import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('applications-route', () => {
  let server = null;

  before(async () => {
    const result = await getServerData();
    server = result.server;
  });

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
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/applications'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (list of apps)', async () => {
      const token = getToken();

      const options = {
        method: 'GET',
        url: '/api/applications',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return list of applications', async () => {
      const token = getToken('read:applications');
      auth0.get('/api/v2/clients', applications);
      const options = {
        method: 'GET',
        url: '/api/applications',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result).to.be.a('array');
      expect(response.result.length).to.equal(1);
      expect(response.result[0].app_type).to.equal('spa');
    });

    it('should return 403 if scope is missing (single app)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/applications/1',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return application data', async () => {
      const token = getToken('read:applications');
      auth0.get('/api/v2/clients/1', applications[1]);
      const options = {
        method: 'GET',
        url: '/api/applications/1',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.client_id).to.be.equal('1');
    });
  });
});
