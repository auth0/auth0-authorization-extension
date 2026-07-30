import expect from 'expect';
import sinon from 'sinon';
import normalizeErrorMiddleware from '../../../../../client/store/middlewares/normalizeErrorMiddleware';

const run = (action) => {
  const next = sinon.spy();
  normalizeErrorMiddleware()({})(next)(action);
  return next;
};

describe('normalizeErrorMiddleware', () => {
  it('always forwards the action to next', () => {
    const action = { type: 'FOO' };
    const next = run(action);

    expect(next.calledOnce).toBe(true);
    expect(next.calledWith(action)).toBe(true);
  });

  it('leaves non-_REJECTED actions untouched', () => {
    const action = { type: 'FETCH_USERS_FULFILLED', payload: { data: { error: 'x' } } };
    run(action);

    expect(action.errorMessage).toBe(undefined);
  });

  it('sets a default message when the payload carries no recognizable error', () => {
    const action = { type: 'FETCH_USERS_REJECTED', payload: {} };
    run(action);

    expect(action.errorMessage).toBe('Unknown Server Error');
  });

  it('maps an aborted-connection payload to the timeout message', () => {
    const action = { type: 'FETCH_USERS_REJECTED', payload: { code: 'ECONNABORTED' } };
    run(action);

    expect(action.errorMessage).toBe('The connectioned timed out.');
  });

  it('prefers payload.data.error', () => {
    const action = { type: 'FETCH_USERS_REJECTED', payload: { data: { error: 'Bad Request' } } };
    run(action);

    expect(action.errorMessage).toBe('Bad Request');
  });

  it('falls back to payload.error', () => {
    const action = { type: 'FETCH_USERS_REJECTED', payload: { error: 'boom' } };
    run(action);

    expect(action.errorMessage).toBe('boom');
  });

  it('falls back to payload.response.data', () => {
    const action = { type: 'FETCH_USERS_REJECTED', payload: { response: { data: 'server said no' } } };
    run(action);

    expect(action.errorMessage).toBe('server said no');
  });

  it('unwraps a nested error.message', () => {
    const action = {
      type: 'FETCH_USERS_REJECTED',
      payload: { data: { error: { message: 'nested detail' } } }
    };
    run(action);

    expect(action.errorMessage).toBe('nested detail');
  });

  it('does nothing when a _REJECTED action has no payload', () => {
    const action = { type: 'FETCH_USERS_REJECTED' };
    const next = run(action);

    expect(action.errorMessage).toBe(undefined);
    expect(next.calledOnce).toBe(true);
  });
});
