import expect from 'expect';
import sinon from 'sinon';
import promiseSuccessMiddleware from '../../../../../client/store/middlewares/promiseSuccessMiddleware';

const run = (action) => {
  const next = sinon.spy();
  promiseSuccessMiddleware()({})(next)(action);
  return next;
};

describe('promiseSuccessMiddleware', () => {
  it('always forwards the action to next', () => {
    const action = { type: 'FOO' };
    const next = run(action);

    expect(next.calledOnce).toBe(true);
    expect(next.calledWith(action)).toBe(true);
  });

  it('calls meta.onSuccess with the payload on a _FULFILLED action', () => {
    const onSuccess = sinon.spy();
    const payload = { data: { users: [] } };

    run({ type: 'FETCH_USERS_FULFILLED', meta: { onSuccess }, payload });

    expect(onSuccess.calledOnce).toBe(true);
    expect(onSuccess.calledWith(payload)).toBe(true);
  });

  it('forwards to next before invoking onSuccess', () => {
    const calls = [];
    const next = () => calls.push('next');
    const onSuccess = () => calls.push('onSuccess');

    promiseSuccessMiddleware()({})(next)({
      type: 'FETCH_USERS_FULFILLED',
      meta: { onSuccess },
      payload: {}
    });

    expect(calls).toEqual([ 'next', 'onSuccess' ]);
  });

  it('does not call onSuccess when the action is not _FULFILLED', () => {
    const onSuccess = sinon.spy();

    run({ type: 'FETCH_USERS_PENDING', meta: { onSuccess }, payload: {} });

    expect(onSuccess.called).toBe(false);
  });

  it('does not throw on a _FULFILLED action without meta', () => {
    const next = run({ type: 'FETCH_USERS_FULFILLED', payload: {} });

    expect(next.calledOnce).toBe(true);
  });

  it('does not throw when meta has no onSuccess', () => {
    const next = run({ type: 'FETCH_USERS_FULFILLED', meta: {}, payload: {} });

    expect(next.calledOnce).toBe(true);
  });
});
