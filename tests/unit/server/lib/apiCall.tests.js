import { expect } from 'chai';
import apiCall from '../../../../server/lib/apiCall';

describe('apiCall', () => {
  it('should unwrap .data from the SDK v4 response', async () => {
    const user = { user_id: 'auth0|123', identities: [ { connection: 'Username-Password-Authentication' } ] };
    const method = () => Promise.resolve({ data: user, status: 200, headers: {} });

    const result = await apiCall({}, method, [ { id: 'auth0|123' } ]);

    expect(result).to.deep.equal(user);
    expect(result.identities).to.be.an('array');
    expect(result.identities[0].connection).to.equal('Username-Password-Authentication');
  });

  it('should throw non-retryable errors immediately', async () => {
    const error = new Error('Not found');
    error.originalError = { status: 404 };
    const method = () => Promise.reject(error);

    try {
      await apiCall({}, method, []);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should not retry when rate limit reset exceeds max retry timeout', async () => {
    const ratelimitReset = Math.round(Date.now() / 1000) + 100;
    const error = new Error('Rate limit');
    error.originalError = {
      status: 429,
      response: { header: { 'x-ratelimit-reset': ratelimitReset } }
    };
    const method = () => Promise.reject(error);

    try {
      await apiCall({}, method, []);
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).to.equal(error);
    }
  });

  it('should retry on 429 and resolve on success', async function() {
    this.timeout(5000);

    const user = { user_id: 'auth0|123', identities: [ { connection: 'Username-Password-Authentication' } ] };
    const ratelimitReset = Math.round(Date.now() / 1000);
    const error = new Error('Rate limit');
    error.originalError = {
      status: 429,
      response: { header: { 'x-ratelimit-reset': ratelimitReset } }
    };

    let callCount = 0;
    const method = () => {
      callCount++;
      if (callCount === 1) return Promise.reject(error);
      return Promise.resolve({ data: user, status: 200, headers: {} });
    };

    const result = await apiCall({}, method, [], 2);

    expect(result).to.deep.equal(user);
    expect(callCount).to.equal(2);
  });
});
