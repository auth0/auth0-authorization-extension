import expect from 'expect';
import { groups } from '../../../client/reducers/groups';
import * as constants from '../../../client/constants';

const initialState = {
  loading: false,
  error: null,
  records: []
};

describe('groups reducer', () => {
  it('should return the initial state', () => {
    expect(
      groups(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle FETCH_GROUPS_PENDING', () => {
    expect(
      groups(initialState, {
        type: constants.FETCH_GROUPS_PENDING,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: true,
        error: null,
        records: []
      }
    );
  });

  it('should handle FETCH_GROUPS_REJECTED', () => {
    expect(
      groups(initialState, {
        type: constants.FETCH_GROUPS_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: 'An error occured while loading the groups: ERROR',
        records: []
      }
    );
  });

  it('should handle FETCH_GROUPS_FULFILLED', () => {
    expect(
      groups(initialState, {
        type: constants.FETCH_GROUPS_FULFILLED,
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
        ]
      }
    );
  });


  it('should handle SAVE_GROUP_FULFILLED', () => {
    expect(
      groups({
        loading: false,
        error: null,
        records: []
      }, {
        type: constants.SAVE_GROUP_FULFILLED,
        payload: {
          data: {
            _id: 1,
            name: 'test'
          }
        },
        meta: {
          groupId: 1
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
        ]
      }
    );
  });

  it('should handle SAVE_GROUP_FULFILLED', () => {
    expect(
      groups({
        loading: false,
        error: null,
        records: [
          {
            _id: 1,
            name: 'test'
          }
        ]
      }, {
        type: constants.SAVE_GROUP_FULFILLED,
        payload: {
          data: {
            _id: 2,
            name: 'test'
          }
        },
        meta: {
          groupId: 1
        }
      }).toJSON()
    ).toEqual(
      {
        loading: false,
        error: null,
        records: [
          {
            _id: 2,
            name: 'test'
          }
        ]
      }
    );
  });

  it('should handle DELETE_GROUP_FULFILLED', () => {
    expect(
      groups(initialState, {
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
