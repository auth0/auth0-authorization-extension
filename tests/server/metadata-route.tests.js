import { expect } from 'chai';
import { getServerData } from '../server';

describe.only('metadata-route', () => {
  const { server } = getServerData();

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
