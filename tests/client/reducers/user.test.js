import expect from 'expect';
import { user } from '../../../client/reducers/user';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  userId: null,
  record: {},
  allGroups: {
    loading: false,
    error: null,
    records: []
  },
  groups: {
    loading: false,
    error: null,
    records: []
  }
};

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(
      user(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_USER_PENDING', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_PENDING,
        meta: {
          userId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        userId: 1,
        record: {},
        allGroups: {
          loading: false,
          error: null,
          records: []
        },
        groups: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle FETCH_USER_REJECTED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the user: ERROR',
        userId: null,
        record: {},
        allGroups: {
          loading: false,
          error: null,
          records: []
        },
        groups: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

  it('should handle FETCH_USER_FULFILLED', () => {
    expect(
      user(initialState, {
        type: constants.FETCH_USER_FULFILLED,
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
        userId: null,
        record: {

        },
        allGroups: {
          loading: false,
          error: null,
          records: []
        },
        groups: {
          loading: false,
          error: null,
          records: []
        }
      }
    );
  });

});
