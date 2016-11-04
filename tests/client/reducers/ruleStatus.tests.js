import expect from 'expect';
import { ruleStatus } from '../../../client/reducers/ruleStatus';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  record: {}
};

describe('ruleStatus reducer', () => {
  it('should return the initial state', () => {
    expect(
      ruleStatus(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_RULE_STATUS', () => {
    expect(
      ruleStatus(initialState, {
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
      ruleStatus(initialState, {
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
      ruleStatus(initialState, {
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
