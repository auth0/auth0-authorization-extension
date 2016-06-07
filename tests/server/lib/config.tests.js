import { expect } from 'chai';
import config, { setProvider } from '../../../server/lib/config';

describe('config', () => {
  describe('#get', () => {
    it('should return nconf settings by default', () => {
      expect(config('DUMMY_KEY')).to.equal('DUMMY_VALUE');
    });

    it('should return setting from provider if configured', () => {
      setProvider((key) => {
        if (key === 'DUMMY_KEY') {
          return 'CUSTOM_VALUE';
        }
        return 12345;
      });
      expect(config('DUMMY_KEY')).to.equal('CUSTOM_VALUE');
    });
  });
});
