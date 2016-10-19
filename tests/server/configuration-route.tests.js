import Promise from 'bluebird';
import { expect } from 'chai';
import { getServerData } from '../server';
import { getToken } from '../token';

describe.only('configuration-route', () => {
  const { db, server } = getServerData();
  const token = getToken();

  before((done) => {
    db.getConfiguration = () => Promise.resolve({
      groupsInToken: false,
      rolesInToken: true
    });
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
  });
});
