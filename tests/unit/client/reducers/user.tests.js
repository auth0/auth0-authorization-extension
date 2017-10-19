import expect from 'expect';
import { user } from '../../../../client/reducers/user';
import * as constants from '../../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  userId: null,
  addRoles: false,
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
        addRoles: false,
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
        addRoles: false,
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
        addRoles: false,
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

  it('should handle ADD_ROLES_OPEN', () => {
    expect(
      user({
        addRoles: false
      }, {
        type: constants.ADD_ROLES_OPEN
      }).toJSON()
    ).toEqual(
      {
        addRoles: true
      }
    );
  });

  it('should handle ADD_ROLES_CLOSE', () => {
    expect(
      user({
        addRoles: true
      }, {
        type: constants.ADD_ROLES_CLOSE
      }).toJSON()
    ).toEqual(
      {
        addRoles: false
      }
    );
  });

  it('should handle SAVE_USER_ROLES_PENDING', () => {
    expect(
      user({
        addRoles: true,
        loading: false
      }, {
        type: constants.SAVE_USER_ROLES_PENDING
      }).toJSON()
    ).toEqual(
      {
        addRoles: true,
        loading: true
      }
    );
  });

  it('should handle SAVE_USER_ROLES_REJECTED', () => {
    expect(
      user({
        addRoles: true,
        loading: false
      }, {
        type: constants.SAVE_USER_ROLES_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        addRoles: false,
        loading: false,
        error: 'Error during saving roles: ERROR'
      }
    );
  });


  it('should handle SAVE_USER_ROLES_FULFILLED', () => {
    expect(
      user({
        addRoles: true,
        loading: false
      }, {
        type: constants.SAVE_USER_ROLES_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        addRoles: false,
        loading: false
      }
    );
  });
});
