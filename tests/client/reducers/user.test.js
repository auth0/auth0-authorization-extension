import expect from 'expect';
import { user } from '../../../client/reducers/user';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {}
};

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(
      user(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_RULE_STATUS', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_RULE_STATUS
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        record: {}
      }
    );
  });

  it('should handle FETCH_RULE_STATUS_REJECTED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_RULE_STATUS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the rule status: ERROR',
        record: {}
      }
    );
  });

  it('should handle FETCH_RULE_STATUS_FULFILLED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_RULE_STATUS_FULFILLED,
        payload: {
          data: {
            id: 1,
            test: 'name'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        record: {
          id: 1,
          test: 'name'
        }
      }
    );
  });

});
