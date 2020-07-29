import Promise from 'bluebird';
import { expect } from 'chai';
import * as auth0 from '../mocks/auth0';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('configuration-route', () => {
  const { db, server } = getServerData();
  const rules = [
    { name: 'auth0-authorization-extension', enabled: true, id: 'ruleId' }
  ];
  const resourceServers = [
    { identifier: 'urn:auth0-authz-api', token_lifetime: 10, id: 'rsid' }
  ];
  let storageData = null;

  before((done) => {
    db.getStatus = () => Promise.resolve({ size: 10, type: 'default' });
    db.getConfiguration = () =>
      Promise.resolve({ groupsInToken: false, rolesInToken: true });
    db.updateConfiguration = (data) => Promise.resolve(data);
    db.updateApiKey = (data) => Promise.resolve(data);
    db.provider = {
      storageContext: {
        read: () => Promise.resolve({ key: 'value' }),
        write: (data) => {
          storageData = data;
          return Promise.resolve();
        }
      }
    };
    done();
  });

  describe('#get', () => {
    it('should return 401 if no token provided', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/configuration'
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(401);
        cb();
      });
    });

    it('should return 403 if scope is missing (get config)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return the config object', (cb) => {
      const token = getToken('read:configuration');
      const options = {
        method: 'GET',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.rolesInToken).to.equal(true);
        cb();
      });
    });

    it('should return the config status', (cb) => {
      const token = getToken('read:configuration');
      auth0.get('/api/v2/rules', rules);
      const options = {
        method: 'GET',
        url: '/api/configuration/status',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.rule).to.be.an('object');
        expect(response.result.rule.exists).to.be.equal(true);
        expect(response.result.rule.enabled).to.be.equal(true);
        expect(response.result.database).to.be.an('object');
        expect(response.result.database.size).to.be.equal(10);
        cb();
      });
    });

    it('should return 403 if scope is missing (export config)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/configuration/export',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return full storage data', (cb) => {
      const token = getToken('read:configuration');
      const options = {
        method: 'GET',
        url: '/api/configuration/export',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.key).to.equal('value');
        cb();
      });
    });

    it('should return 403 if scope is missing (get resource-server)', (cb) => {
      const token = getToken();
      const options = {
        method: 'GET',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return resource-server data', (cb) => {
      const token = getToken('read:resource-server');
      auth0.get('/api/v2/resource-servers', resourceServers);
      const options = {
        method: 'GET',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.apiAccess).to.equal(true);
        expect(response.result.token_lifetime).to.equal(10);
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return 403 if scope is missing (update config)', (cb) => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/configuration',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.equal(400);
        expect(response.result.message).to.equal(
          '"groupsInToken" must be a boolean'
        );
        cb();
      });
    });

    it('should update configuration', (cb) => {
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
          groupsInToken: 'yes'
        }
      };

      server.inject(options, (response) => {
        expect(response.result.groupsInToken).to.equal(true);
        cb();
      });
    });

    it('should return 403 if scope is missing (update resource-server)', (cb) => {
      const token = getToken();
      const options = {
        method: 'PATCH',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should update resource-server', (cb) => {
      const token = getToken('update:resource-server');
      auth0.get('/api/v2/resource-servers', resourceServers);
      auth0.get('/api/v2/resource-servers', resourceServers);
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        cb();
      });
    });

    it('should rotate apikey and return hash', (cb) => {
      const token = getToken('update:configuration');
      auth0.put('/api/v2/rules-configs/AUTHZ_EXT_API_KEY');
      const options = {
        method: 'PATCH',
        url: '/api/configuration/rotate-apikey',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.hash).to.be.a('string');
        expect(response.result.hash.length).to.be.equal(64);
        cb();
      });
    });
  });

  describe('#post', () => {
    it('should return 403 if scope is missing (import config)', (cb) => {
      const token = getToken();
      const options = {
        method: 'POST',
        url: '/api/configuration/import',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should return validation error', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.equal(400);
        expect(response.result.message).to.equal('"key" is not allowed');
        cb();
      });
    });

    it('should import configuration', (cb) => {
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

      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        expect(storageData.configuration[0].persistRoles).to.equal(true);
        cb();
      });
    });
  });

  describe('#delete', () => {
    it('should return 403 if scope is missing (disable resource-server)', (cb) => {
      const token = getToken();
      const options = {
        method: 'DELETE',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.statusCode).to.be.equal(403);
        cb();
      });
    });

    it('should delete resource-server', (cb) => {
      const token = getToken('delete:resource-server');
      auth0.get('/api/v2/resource-servers', resourceServers);
      auth0.delete('/api/v2/resource-servers/rsid');
      const options = {
        method: 'DELETE',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.statusCode).to.equal(204);
        cb();
      });
    });
  });
});
