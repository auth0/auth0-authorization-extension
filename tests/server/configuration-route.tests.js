import Promise from 'bluebird';
import { expect } from 'chai';
import createServer from '../../server';
import { init as initDb } from '../../server/lib/storage/getdb';

describe.only('configuration-route', () => {
  let db = null;
  let server = null;

  beforeEach((done) => {
    db = { };
    initDb(db);

    createServer((err, s) => {
      server = s;
      done(err);
    });
  });

  describe('#get', () => {
    it('should return the config object', (cb) => {
      db.getConfiguration = () => Promise.resolve({
        groupsInToken: false,
        rolesInToken: true
      });
      const options = {
        method: 'GET',
        url: '/configuration'
      };

      server.inject(options, (response) => {
        expect(response.result.rolesInToken).to.equal(true);
        cb();
      });
    });
  });
});
