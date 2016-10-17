import expect from 'expect';
import { roles } from '../../../client/reducers/roles';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: []
};

describe('groups reducer', () => {
  it('should return the initial state', () => {
    expect(
      roles(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_ROLES_PENDING', () => {
    expect(
      roles(initialState, {
        type: constants.FETCH_ROLES_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: []
      }
    );
  });

  it('should handle FETCH_ROLES_REJECTED', () => {
    expect(
      roles(initialState, {
        type: constants.FETCH_ROLES_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the roles: ERROR',
        records: []
      }
    );
  });

  it('should handle FETCH_ROLES_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.FETCH_ROLES_FULFILLED,
        payload: {
          data: [
            { id: 2, 'test2' },
            { id: 1, 'test1' }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          { id: 1, 'test1' },
          { id: 2, 'test2' }
        ]
      }
    );
  });


  it('should handle SAVE_ROLE_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.SAVE_ROLE_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: []
      }
    );
  });

  it('should handle DELETE_GROUP_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.DELETE_GROUP_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: []
      }
    );
  });
});
