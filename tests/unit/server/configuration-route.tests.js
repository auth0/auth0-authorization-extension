import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('configuration-route', async () => {
  let server = null;
  let db = null;
  let storageData = null;

  const rules = [ { name: 'auth0-authorization-extension', enabled: true, id: 'ruleId' } ];
  const resourceServer = { identifier: 'urn:auth0-authz-api', token_lifetime: 10, id: 'rsid' };

  before(async () => {
    const result = await getServerData();
    server = result.server;
    db = result.db;

    db.getStatus = () => Promise.resolve({ size: 10, type: 'default' });
    db.getConfiguration = () =>
      Promise.resolve({ groupsInToken: false, rolesInToken: true });
    db.updateConfiguration = (data) => Promise.resolve(data);
    db.updateApiKey = (data) => Promise.resolve(data);
    db.getApiKey = () => Promise.resolve('fake_api_key');
    db.provider = {
      storageContext: {
        read: () => Promise.resolve({ key: 'value' }),
        write: (data) => {
          storageData = data;
          return Promise.resolve();
        }
      }
    };
  });


  describe('#get', () => {
    it('should return 401 if no token provided', async () => {
      const options = {
        method: 'GET',
        url: '/api/configuration'
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(401);
    });

    it('should return 403 if scope is missing (get config)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return the config object', async () => {
      const token = getToken('read:configuration');
      const options = {
        method: 'GET',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.rolesInToken).to.equal(true);
    });

    it('should return the config status', async () => {
      const token = getToken('read:configuration');
      auth0.get('/api/v2/rules', rules);
      const options = {
        method: 'GET',
        url: '/api/configuration/status',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.rule).to.be.an('object');
      expect(response.result.rule.exists).to.be.equal(true);
      expect(response.result.rule.enabled).to.be.equal(true);
      expect(response.result.database).to.be.an('object');
      expect(response.result.database.size).to.be.equal(10);
    });

    it('should return 403 if scope is missing (export config)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/configuration/export',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return full storage data', async () => {
      const token = getToken('read:configuration');
      const options = {
        method: 'GET',
        url: '/api/configuration/export',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.key).to.equal('value');
    });

    it('should return 403 if scope is missing (get resource-server)', async () => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return resource-server data', async () => {
      const token = getToken('read:resource-server');
      auth0.get('/api/v2/resource-servers/urn:auth0-authz-api', resourceServer);
      const options = {
        method: 'GET',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.apiAccess).to.equal(true);
      expect(response.result.token_lifetime).to.equal(10);
    });

    it('should return resource-server empty when resource server not found', async () => {
      const token = getToken('read:resource-server');
      auth0.get('/api/v2/resource-servers/urn:auth0-authz-api', {});
      const options = {
        method: 'GET',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.apiAccess).to.equal(false);
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update config)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:configuration');
      const options = {
        method: 'PATCH',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: {
          groupsInToken: 'noes'
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.equal(400);
      expect(response.result.message).to.equal(
        '"groupsInToken" must be a boolean'
      );
    });

    it('should update configuration', async () => {
      const token = getToken('update:configuration');
      auth0.get('/api/v2/rules', rules);
      auth0.patch('/api/v2/rules/ruleId', rules);
      const options = {
        method: 'PATCH',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: {
          // server/api/configuration/schemas/configuration.js specifically allows 'yes' and 'no' as booleans
          groupsInToken: 'yes'
        }
      };

      const response = await server.inject(options);
      expect(response.result.groupsInToken).to.equal(true);
    });

    it('should return 403 if scope is missing (update resource-server)', async () => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should update resource-server', async () => {
      const token = getToken('update:resource-server');
      auth0.get('/api/v2/resource-servers/urn:auth0-authz-api', resourceServer, 200, 2);
      auth0.patch('/api/v2/resource-servers/rsid');
      const options = {
        method: 'PATCH',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: {
          apiAccess: true,
          token_lifetime: 10
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
    });

    it('should rotate apikey and return hash', async () => {
      const token = getToken('update:configuration');
      auth0.put('/api/v2/rules-configs/AUTHZ_EXT_API_KEY');
      const options = {
        method: 'PATCH',
        url: '/api/configuration/rotate-apikey',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.hash).to.be.a('string');
      expect(response.result.hash.length).to.be.equal(64);
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (import config)', async () => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/configuration/import',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should return validation error', async () => {
      const token = getToken('update:configuration');
      const options = {
        method: 'POST',
        url: '/api/configuration/import',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: {
          key: 'value'
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.equal(400);
      expect(response.result.message).to.equal('"key" is not allowed');
    });

    it('should import configuration', async () => {
      const token = getToken('update:configuration');
      const options = {
        method: 'POST',
        url: '/api/configuration/import',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: {
          configuration: [
            {
              _id: 'v1',
              persistRoles: true
            }
          ]
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
      expect(storageData.configuration[0].persistRoles).to.equal(true);
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (disable resource-server)', async () => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.result.statusCode).to.be.equal(403);
    });

    it('should delete resource-server', async () => {
      const token = getToken('delete:resource-server');
      auth0.get('/api/v2/resource-servers/urn:auth0-authz-api', resourceServer);
      auth0.delete('/api/v2/resource-servers/rsid');
      const options = {
        method: 'DELETE',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await server.inject(options);
      expect(response.statusCode).to.equal(204);
    });
  });
});
