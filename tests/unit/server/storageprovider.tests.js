import { expect } from 'chai';
import Database from '../../../server/lib/storage/database';

describe('Database', () => {
  describe('#constructor', () => {
    it('should require a provider', (done) => {
      const run = () => {
        const database = new Database(); // eslint-disable-line no-unused-vars
      };
      expect(run)
        .to.throw('The \'provider\' has to be set when initializing the database.');
      done();
    });

    it('should initialize correctly', (done) => {
      const database = new Database({ // eslint-disable-line no-unused-vars
        provider: { }
      });
      done();
    });
  });
});
