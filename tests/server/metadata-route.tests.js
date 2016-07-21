import { expect } from 'chai';
import createServer from '../../server/server';
import { init as initDb } from '../../server/lib/storage/getdb';

describe('metadata-route', () => {
  let server = null;

  before((done) => {
    initDb({ });

    createServer((err, s) => {
      server = s;
      done(err);
    });
  });

  describe('#get', () => {
    it('should return the webtask.json file', (cb) => {
      const options = {
        method: 'GET',
        url: '/meta'
      };

      server.inject(options, (response) => {
        expect(response.result.name).to.equal('auth0-authz');
        cb();
      });
    });
  });
});
