import expect from 'expect';
import { groupRoles } from '../../../../client/reducers/groupRoles';
import * as constants from '../../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  deleting: false,
  records: [],
  record: null,
  ids: []
};

describe('group roles reducer', () => {
  it('should return the initial state', () => {
    expect(
      groupRoles(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_GROUP_ROLES_PENDING', () => {
    expect(
      groupRoles(initialState, {
        type: constants.FETCH_GROUP_ROLES_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        deleting: false,
        records: [],
        record: null,
        ids: []
      }
    );
  });

  it('should handle FETCH_GROUP_ROLES_REJECTED', () => {
    expect(
      groupRoles(initialState, {
        type: constants.FETCH_GROUP_ROLES_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the roles: ERROR',
        deleting: false,
        records: [],
        record: null,
        ids: []
      }
    );
  });

  it('should handle FETCH_GROUP_ROLES_FULFILLED', () => {
    expect(
      groupRoles(initialState, {
        type: constants.FETCH_GROUP_ROLES_FULFILLED,
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
        record: null,
        ids: [1, 2],
        records: [
          { _id: 1, name: 'test1' },
          { _id: 2, name: 'test2' }
        ]

      }
    );
  });


  it('should handle REQUEST_DELETE_GROUP_ROLE', () => {
    expect(
      groupRoles(initialState, {
        type: constants.REQUEST_DELETE_GROUP_ROLE,
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
        record: 1,
        ids: []
      }
    );
  });

  it('should handle CANCEL_DELETE_GROUP_ROLE', () => {
    expect(
      groupRoles(initialState, {
        type: constants.CANCEL_DELETE_GROUP_ROLE,
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        deleting: false,
        records: [],
        record: null,
        ids: []
      }
    );
  });

  it('should handle DELETE_GROUP_ROLE_PENDING', () => {
    expect(
      groupRoles(initialState, {
        type: constants.DELETE_GROUP_ROLE_PENDING
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        deleting: false,
        records: [],
        record: null,
        ids: []
      }
    );
  });

  it('should handle DELETE_GROUP_ROLE_REJECTED', () => {
    expect(
      groupRoles(initialState, {
        type: constants.DELETE_GROUP_ROLE_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while deleting the role: ERROR',
        deleting: false,
        records: [],
        record: null,
        ids: []
      }
    );
  });

  it('should handle DELETE_GROUP_ROLE_FULFILLED', () => {
    expect(
      groupRoles(initialState, {
        type: constants.DELETE_GROUP_ROLE_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
