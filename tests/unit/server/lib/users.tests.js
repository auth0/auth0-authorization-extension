import { expect } from 'chai';
import { getUsersById } from '../../../../server/lib/users';

describe('getUsersById', () => {
  const makeClient = (getUserFn) => ({
    users: {
      get: getUserFn
    }
  });

  const successClient = (ids) =>
    makeClient(({ id }) =>
      Promise.resolve({
        data: { user_id: id, name: 'Test User', email: `${id}@example.com`, identities: [ { connection: 'test' } ] }
      })
    );

  it('should return users and total for the requested page', async () => {
    const ids = [ 'auth0|user1', 'auth0|user2' ];
    const result = await getUsersById(successClient(ids), ids, 1, 10);

    expect(result.total).to.equal(2);
    expect(result.users).to.have.length(2);
  });

  it('should return the full id list total even when paged', async () => {
    const ids = [ 'auth0|user1', 'auth0|user2', 'auth0|user3' ];
    const result = await getUsersById(successClient(ids), ids, 1, 2);

    expect(result.total).to.equal(3);
    expect(result.users).to.have.length(2);
  });

  it('should return the correct page of users', async () => {
    const ids = [ 'auth0|user1', 'auth0|user2', 'auth0|user3' ];
    const result = await getUsersById(successClient(ids), ids, 2, 2);

    expect(result.total).to.equal(3);
    expect(result.users).to.have.length(1);
    expect(result.users[0].user_id).to.equal('auth0|user3');
  });

  it('should treat page 0 the same as page 1', async () => {
    const ids = [ 'auth0|user1', 'auth0|user2' ];

    const page0 = await getUsersById(successClient(ids), ids, 0, 10);
    const page1 = await getUsersById(successClient(ids), ids, 1, 10);

    expect(page0.users.map((u) => u.user_id)).to.deep.equal(page1.users.map((u) => u.user_id));
  });

  it('should return users sorted by user_id', async () => {
    const ids = [ 'auth0|user_b', 'auth0|user_a', 'auth0|user_c' ];
    const result = await getUsersById(successClient(ids), ids, 1, 10);

    expect(result.users.map((u) => u.user_id)).to.deep.equal([
      'auth0|user_a',
      'auth0|user_b',
      'auth0|user_c'
    ]);
  });

  it('should return a placeholder when a user fetch fails', async () => {
    const ids = [ 'auth0|valid', 'auth0|missing' ];
    const client = makeClient(({ id }) => {
      if (id === 'auth0|missing') {
        const err = new Error('Not Found');
        err.name = 'NotFoundError';
        return Promise.reject(err);
      }
      return Promise.resolve({
        data: { user_id: id, name: 'Valid User', email: `${id}@example.com`, identities: [ { connection: 'test' } ] }
      });
    });

    const result = await getUsersById(client, ids, 1, 10);

    expect(result.total).to.equal(2);
    expect(result.users).to.have.length(2);

    const placeholder = result.users.find((u) => u.user_id === 'auth0|missing');
    expect(placeholder).to.exist;
    expect(placeholder.name).to.equal('<Error: NotFoundError>');
    expect(placeholder.email).to.equal('auth0|missing');
    expect(placeholder.identities).to.deep.equal([ { connection: 'N/A' } ]);
  });

  it('should use statusCode in placeholder when error has no name', async () => {
    const ids = [ 'auth0|user1' ];
    const client = makeClient(() => {
      const err = new Error('Server Error');
      err.name = undefined;
      err.statusCode = 500;
      return Promise.reject(err);
    });

    const result = await getUsersById(client, ids, 1, 10);

    expect(result.users[0].name).to.equal('<Error: 500>');
  });

  it('should process more than 10 ids across multiple batches', async () => {
    const count = 25;
    const ids = Array.from({ length: count }, (_, i) => `auth0|user${String(i).padStart(2, '0')}`);

    let callCount = 0;
    const client = makeClient(({ id }) => {
      callCount++;
      return Promise.resolve({
        data: { user_id: id, name: 'Test', email: `${id}@example.com`, identities: [] }
      });
    });

    const result = await getUsersById(client, ids, 1, 100);

    expect(result.total).to.equal(count);
    expect(result.users).to.have.length(count);
    expect(callCount).to.equal(count);
  });

  it('should not mutate the input ids array', async () => {
    const ids = [ 'auth0|user1', 'auth0|user2', 'auth0|user3' ];
    const original = [ ...ids ];

    await getUsersById(successClient(ids), ids, 1, 2);

    expect(ids).to.deep.equal(original);
  });
});
