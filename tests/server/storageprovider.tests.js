import { expect } from 'chai';
import Database from '../../server/lib/storage/database';

describe.only('Database', () => {
  describe('#constructor', () => {
    it('should require a provider', (done) => {
      const run = () => {
        const database = new Database();
      };
      expect(run)
        .to.throw('The \'provider\' has to be set when initializing the database.');
      done();
    });

    it('should initialize correctly', (done) => {
      const database = new Database({
        provider: { }
      });
      done();
    });
  });
});
