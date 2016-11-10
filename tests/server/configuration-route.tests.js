import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../mocks/tokens';

describe('configuration-route', () => {
  const { db, server } = getServerData();
  const token = getToken();
  let storageData = null;

  before((done) => {
    db.getStatus = () => Promise.resolve({ size: 10, type: 'default' });
    db.getConfiguration = () => Promise.resolve({ groupsInToken: false, rolesInToken: true });
    db.updateConfiguration = (data) => Promise.resolve(data);
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

    it('should return the config object', (cb) => {
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
      const options = {
        method: 'GET',
        url: '/api/configuration/status',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.rule).to.be.an('object');
        expect(response.result.database).to.be.an('object');
        expect(response.result.database.size).to.be.equal(10);
        cb();
      });
    });

    it('should return full storage data', (cb) => {
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

    it('should return resource-server data', (cb) => {
      const options = {
        method: 'GET',
        url: '/api/configuration/resource-server',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      server.inject(options, (response) => {
        expect(response.result.apiAccess).to.be.a('boolean');
        cb();
      });
    });
  });

  describe('#patch', () => {
    it('should return validation error', (cb) => {
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
        expect(response.result.message).to.equal('"groupsInToken" must be a boolean');
        cb();
      });
    });

    it('should update configuration', (cb) => {
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

    it('should update resource-server', (cb) => {
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
  });

  describe('#post', () => {
    it('should return validation error', (cb) => {
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
      const options = {
        method: 'POST',
        url: '/api/configuration/import',
        headers: {
          Authorization: `Bearer ${token}`
        },
        payload: {
          configuration: [ {
            _id: 'v1',
            persistRoles: true
          } ]
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
    it('should delete resource-server', (cb) => {
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
