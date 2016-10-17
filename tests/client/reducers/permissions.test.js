import expect from 'expect';
import { permissions } from '../../../client/reducers/permissions';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: []
};

describe('permissions reducer', () => {
  it('should return the initial state', () => {
    expect(
      permissions(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_PERMISSIONS_PENDING', () => {
    expect(
      permissions(initialState, {
        type: constants.FETCH_PERMISSIONS_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: []
      }
    );
  });

  it('should handle FETCH_PERMISSIONS_REJECTED', () => {
    expect(
      permissions(initialState, {
        type: constants.FETCH_PERMISSIONS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the permissions: ERROR',
        records: []
      }
    );
  });

  it('should handle FETCH_PERMISSIONS_FULFILLED', () => {
    expect(
      permissions(initialState, {
        type: constants.FETCH_PERMISSIONS_FULFILLED,
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


  it('should handle SAVE_PERMISSION_FULFILLED', () => {
    expect(
      permissions(initialState, {
        type: constants.SAVE_PERMISSION_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: []
      }
    );
  });

  it('should handle DELETE_PERMISSION_FULFILLED', () => {
    expect(
      permissions(initialState, {
        type: constants.DELETE_PERMISSION_FULFILLED
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
