import expect from 'expect';
import { groupNested } from '../../../client/reducers/groupNested';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  isRemove: false,
  groupId: null,
  groupName: null,
  nestedGroupId: null,
  nestedGroupName: null
};

describe('groupNested reducer', () => {
  it('should return the initial state', () => {
    expect(
      groupNested(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_REMOVE_GROUP_NESTED', () => {
    expect(
      groupNested(initialState, {
        type: constants.REQUEST_REMOVE_GROUP_NESTED,
        meta: {
          group: {
            _id: 1,
            name: 'test'
          },
          nestedGroup: {
            _id: 2,
            name: 'test_2'
          }
        }
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: false,
        requesting: true,
        isRemove: true,
        groupId: 1,
        groupName: 'test',
        nestedGroupId: 2,
        nestedGroupName: 'test_2'
      }
    );
  });

  it('should handle CANCEL_REMOVE_GROUP_NESTED', () => {
    expect(
      groupNested(initialState, {
        type: constants.CANCEL_REMOVE_GROUP_NESTED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REMOVE_GROUP_NESTED_PENDING', () => {
    expect(
      groupNested(initialState, {
        type: constants.REMOVE_GROUP_NESTED_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        isRemove: false,
        groupId: null,
        groupName: null,
        nestedGroupId: null,
        nestedGroupName: null
      }
    );
  });

  it('should handle REMOVE_GROUP_NESTED_REJECTED', () => {
    expect(
      groupNested(initialState, {
        type: constants.REMOVE_GROUP_NESTED_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while removing the nested group: ERROR',
        loading: false,
        requesting: false,
        isRemove: false,
        groupId: null,
        groupName: null,
        nestedGroupId: null,
        nestedGroupName: null
      }
    );
  });

  it('should handle REMOVE_GROUP_NESTED_FULFILLED', () => {
    expect(
      groupNested(initialState, {
        type: constants.REMOVE_GROUP_NESTED_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
