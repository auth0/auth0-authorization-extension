import { expect } from 'chai';
import { getServerData } from '../server';

describe('metadata-route', async () => {
  let server = null;

  before(async () => {
    const result = await getServerData();
    server = result.server;
  });

  describe('#get', () => {
    it('should return the webtask.json file', async () => {
      const options = {
        method: 'GET',
        url: '/meta'
      };

      const response = await server.inject(options);
      expect(response.result.name).to.equal('auth0-authz');
    });
  });
});
