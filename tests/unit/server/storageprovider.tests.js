/* eslint-disable no-unused-vars */
import { expect } from 'chai';
import Database from '../../../server/lib/storage/database';

describe('Database', () => {
  describe('#constructor', () => {
    it('should require a provider', () => {
      try {
        const database = new Database();
        expect.fail('The \'provider\' has to be set when initializing the database.');
      } catch (error) {
        expect(error.message).to.equal('The \'provider\' has to be set when initializing the database.');
      }
    });

    it('should initialize correctly', () => {
      const database = new Database({
        provider: { }
      });
    });
  });
});
