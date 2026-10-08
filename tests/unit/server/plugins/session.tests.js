import { expect } from 'chai';
import nock from 'nock';
import certs from '../../mocks/certs.json';
import { wellKnownEndpoint, sign } from '../../mocks/tokens';
import config from '../../../../server/lib/config';
import { getServerData } from '../../server';

const RTA_DOMAIN = 'auth0.auth0.local';
const RTA_WITH_SCHEME = `https://${RTA_DOMAIN}`;

const makeIdToken = (nonce) =>
  sign(certs.test.privateKey, 'key2', {
    iss: `${RTA_WITH_SCHEME}/`,
    aud: 'http://foo',
    sub: 'auth0|testuser',
    nonce
  });

describe('session plugin /login/callback CSRF protection', () => {
  let server;
  const nonce = 'test-nonce-abc123';
  const state = 'test-state-xyz789';

  before(async () => {
    config.setValue('AUTH0_RTA', RTA_WITH_SCHEME);
    wellKnownEndpoint(RTA_DOMAIN, 'key2').persist();
    const result = await getServerData();
    server = result.server;
  });

  after(() => {
    config.setValue('AUTH0_RTA', undefined);
    nock.cleanAll();
    wellKnownEndpoint('foo.auth0.local', 'key2');
  });

  it('should return 400 when no cookies are present', async () => {
    const idToken = makeIdToken(nonce);
    const res = await server.inject({
      method: 'POST',
      url: '/login/callback',
      payload: { id_token: idToken, state }
    });
    expect(res.result.statusCode).to.equal(400);
    expect(res.result.message).to.equal('Missing nonce cookie');
  });

  it('should return 400 when nonce cookie is present but mismatches token nonce', async () => {
    const idToken = makeIdToken('different-nonce');
    const res = await server.inject({
      method: 'POST',
      url: '/login/callback',
      headers: { Cookie: `authz-nonce_compat=${nonce}; authz-state_compat=${state}` },
      payload: { id_token: idToken, state }
    });
    expect(res.result.statusCode).to.equal(400);
    expect(res.result.message).to.equal('Nonce mismatch');
  });

  it('should return 400 when nonce cookie matches but state cookie is absent', async () => {
    const idToken = makeIdToken(nonce);
    const res = await server.inject({
      method: 'POST',
      url: '/login/callback',
      headers: { Cookie: `authz-nonce_compat=${nonce}` },
      payload: { id_token: idToken, state }
    });
    expect(res.result.statusCode).to.equal(400);
    expect(res.result.message).to.equal('Missing state cookie');
  });

  it('should return 400 when state cookie is present but mismatches payload state', async () => {
    const idToken = makeIdToken(nonce);
    const res = await server.inject({
      method: 'POST',
      url: '/login/callback',
      headers: { Cookie: `authz-nonce_compat=${nonce}; authz-state_compat=wrong-state` },
      payload: { id_token: idToken, state }
    });
    expect(res.result.statusCode).to.equal(400);
    expect(res.result.message).to.equal('State mismatch');
  });
});
