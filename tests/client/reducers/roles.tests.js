import expect from 'expect';
import { roles } from '../../../client/reducers/roles';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: [],
  fetchQuery: null
};

describe('roles reducer', () => {
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
        records: [],
        fetchQuery: null
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
        records: [],
        fetchQuery: null
      }
    );
  });

  it('should handle FETCH_ROLES_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.FETCH_ROLES_FULFILLED,
        payload: {
          data: [
            { id: 2, name: 'test2' },
            { id: 1, name: 'test1' }
          ]
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
        fetchQuery: null
      }
    );
  });

  it('should handle FETCH_ROLES_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.FETCH_ROLES_FULFILLED,
        payload: {
          data: [
            { id: 2, name: 'test2' },
            { id: 1, name: 'test1' }
          ],
          config: {
            params: {
              q: 'test'
            }
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
        fetchQuery: 'test'
      }
    );
  });

  it('should handle SAVE_ROLE_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.SAVE_ROLE_FULFILLED,
        payload: {
          data: {
            _id:1,
            name: 'test'
          }
        },
        meta: {
          roleId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            _id:1,
            name: 'test'
          }
        ],
        fetchQuery: null
      }
    );
  });

  it('should handle SAVE_ROLE_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.SAVE_ROLE_FULFILLED,
        payload: {
          data: {
            _id:1,
            name: 'test'
          }
        },
        meta: {
          roleId: 2
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            _id:1,
            name: 'test'
          }
        ],
        fetchQuery: null
      }
    );
  });

  it('should handle DELETE_ROLE_FULFILLED', () => {
    expect(
      roles(initialState, {
        type: constants.DELETE_ROLE_FULFILLED
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [],
        fetchQuery: null
      }
    );
  });
});
