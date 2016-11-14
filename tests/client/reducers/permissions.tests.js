import expect from 'expect';
import { permissions } from '../../../client/reducers/permissions';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: [],
  total: 0
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
        records: [],
        total: 0
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
        records: [],
        total: 0
      }
    );
  });

  it('should handle FETCH_PERMISSIONS_FULFILLED', () => {
    expect(
      permissions(initialState, {
        type: constants.FETCH_PERMISSIONS_FULFILLED,
        payload: {
          data: {
            permissions: [
              { id: 2, name: 'test2' },
              { id: 1, name: 'test1' }
            ],
            total: 2
          }
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          { id: 1, name: 'test1' },
          { id: 2, name: 'test2' }
        ],
        total: 2
      }
    );
  });


  it('should handle SAVE_PERMISSION_FULFILLED', () => {
    expect(
      permissions(initialState, {
        type: constants.SAVE_PERMISSION_FULFILLED,
        payload: {
          data: {
            _id: 1,
            name: 'test'
          }
        },
        meta: {
          permissionId:1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            _id: 1,
            name: 'test'
          }
        ],
        total: 0
      }
    );
  });

  it('should handle SAVE_PERMISSION_FULFILLED', () => {
    expect(
      permissions({
        loading: false,
        error: null,
        records: [{
          _id: 1,
          name: 'test'
        }],
        total: 0
      }, {
        type: constants.SAVE_PERMISSION_FULFILLED,
        payload: {
          data: {
            _id: 1,
            name: 'test'
          }
        },
        meta: {
          permissionId:1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            _id: 1,
            name: 'test'
          }
        ],
        total: 0
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
        records: [],
        total: 0
      }
    );
  });
});
