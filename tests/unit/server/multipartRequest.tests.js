
import _ from 'lodash';
import { expect } from 'chai';
import { ManagementClient } from 'auth0';

import * as auth0Nocks from '../mocks/auth0';
import { getToken } from '../mocks/tokens';
import multipartRequest from '../../../server/lib/multipartRequest';
import config from '../../../server/lib/config';

const buildClients = (count) => Array.from({ length: count }, (_value, index) => ({
  name: `app_${index}`,
  global: false,
  app_type: 'spa',
  client_id: `client_id_${index}`
}));

describe('multipartRequest', () => {
  let auth0Client;

  beforeEach(() => {
    const token = getToken('read:applications');
    auth0Client = new ManagementClient({ domain: config('AUTH0_DOMAIN'), token });
  });

  it('should fetch 10 clients in 1 request', async () => {
    const applications = buildClients(10);

    auth0Nocks.get('/api/v2/clients', applications, 200, 1, { include_totals: 'true', per_page: '100', page: '0' });

    const result = await multipartRequest(auth0Client, 'clients', {}, 100);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(10);
    expect(result).to.deep.equal(applications);
  });

  it('should fetch 150 clients in 2 requests', async () => {
    const applications = buildClients(150);
    const applicationsChunked = _.chunk(applications, 100);

    // first request contains totals
    auth0Nocks.get('/api/v2/clients',
      { clients: applicationsChunked[0], total: 150 },
      200,
      1,
      { include_totals: 'true', per_page: '100', page: '0' });
    auth0Nocks.get('/api/v2/clients', applicationsChunked[1], 200, 1, { page: '1' });

    const result = await multipartRequest(auth0Client, 'clients', {}, 100);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(150);
    expect(result).to.deep.equal(applications);
  });

  it('should fetch 500 clients in 5 requests', async () => {
    const applications = buildClients(500);
    const applicationsChunked = _.chunk(applications, 100);

    // first request contains totals
    auth0Nocks.get('/api/v2/clients',
      { clients: applicationsChunked[0], total: 500 },
      200,
      1,
      { include_totals: 'true', per_page: '100', page: '0' });
    auth0Nocks.get('/api/v2/clients', applicationsChunked[1], 200, 1, { page: '1' });
    auth0Nocks.get('/api/v2/clients', applicationsChunked[2], 200, 1, { page: '2' });
    auth0Nocks.get('/api/v2/clients', applicationsChunked[3], 200, 1, { page: '3' });
    auth0Nocks.get('/api/v2/clients', applicationsChunked[4], 200, 1, { page: '4' });

    const result = await multipartRequest(auth0Client, 'clients', {}, 100);

    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(500);
    expect(result).to.deep.equal(applications);
  });
});
