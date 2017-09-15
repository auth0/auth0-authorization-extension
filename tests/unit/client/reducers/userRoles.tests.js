import expect from 'expect';
import { userRoles } from '../../../../client/reducers/userRoles';
import * as constants from '../../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  deleting: false,
  records: [],
  allRoles: {
    loading: false,
    error: null,
    records: []
  },
  record: null,
  ids: []
};

describe('user roles reducer', () => {
  it('should return the initial state', () => {
    expect(
      userRoles(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_USER_ROLES_PENDING', () => {
    expect(
      userRoles(initialState, {
        type: constants.FETCH_USER_ROLES_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        deleting: false,
        records: [],
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: null,
        ids: []
      }
    );
  });

  it('should handle FETCH_USER_ROLES_REJECTED', () => {
    expect(
      userRoles(initialState, {
        type: constants.FETCH_USER_ROLES_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the roles: ERROR',
        deleting: false,
        records: [],
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: null,
        ids: []
      }
    );
  });

  it('should handle FETCH_USER_ROLES_FULFILLED', () => {
    expect(
      userRoles(initialState, {
        type: constants.FETCH_USER_ROLES_FULFILLED,
        payload: {
          data: [
            { _id: 1, name: 'test1' },
            { _id: 2, name: 'test2' }
          ]
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        deleting: false,
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: null,
        ids: [1, 2],
        records: [
          { _id: 1, name: 'test1' },
          { _id: 2, name: 'test2' }
        ]

      }
    );
  });


  it('should handle REQUEST_DELETE_USER_ROLE', () => {
    expect(
      userRoles(initialState, {
        type: constants.REQUEST_DELETE_USER_ROLE,
        meta: {
          role: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        deleting: true,
        records: [],
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: 1,
        ids: []
      }
    );
  });

  it('should handle CANCEL_DELETE_USER_ROLE', () => {
    expect(
      userRoles(initialState, {
        type: constants.CANCEL_DELETE_USER_ROLE,
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        deleting: false,
        records: [],
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: null,
        ids: []
      }
    );
  });

  it('should handle DELETE_USER_ROLE_PENDING', () => {
    expect(
      userRoles(initialState, {
        type: constants.DELETE_USER_ROLE_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        deleting: true,
        records: [],
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: null,
        ids: []
      }
    );
  });

  it('should handle DELETE_USER_ROLE_REJECTED', () => {
    expect(
      userRoles(initialState, {
        type: constants.DELETE_USER_ROLE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while deleting the role: ERROR',
        deleting: false,
        records: [],
        allRoles: {
          loading: false,
          error: null,
          records: []
        },
        record: null,
        ids: []
      }
    );
  });

  it('should handle DELETE_USER_ROLE_FULFILLED', () => {
    expect(
      userRoles(initialState, {
        type: constants.DELETE_USER_ROLE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
