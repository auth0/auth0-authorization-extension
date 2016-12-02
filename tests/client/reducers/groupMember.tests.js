import expect from 'expect';
import { groupMember } from '../../../client/reducers/groupMember';
import * as constants from '../../../client/constants';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  isRemove: false,
  groupId: null,
  groupName: null,
  userId: null,
  userDisplayName: null
};

describe('groupMember reducer', () => {
  it('should return the initial state', () => {
    expect(
      groupMember(undefined, {}).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REQUEST_REMOVE_GROUP_MEMBER', () => {
    expect(
      groupMember(initialState, {
        type: constants.REQUEST_REMOVE_GROUP_MEMBER,
        meta: {
          group: {
            _id: 1,
            name: 'test'
          },
          user: {
            user_id: 2,
            user_name: 'test_2'
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
        userId: 2,
        userDisplayName: 'test_2'
      }
    );
  });

  it('should handle REQUEST_REMOVE_GROUP_MEMBER', () => {
    expect(
      groupMember(initialState, {
        type: constants.REQUEST_REMOVE_GROUP_MEMBER,
        meta: {
          group: {
            _id: 1,
            name: 'test'
          },
          user: {
            user_id: 2,
            email: 'test_2@mail.com'
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
        userId: 2,
        userDisplayName: 'test_2@mail.com'
      }
    );
  });

  it('should handle CANCEL_REMOVE_GROUP_MEMBER', () => {
    expect(
      groupMember(initialState, {
        type: constants.CANCEL_REMOVE_GROUP_MEMBER
      }).toJSON()
    ).toEqual(
      initialState
    );
  });

  it('should handle REMOVE_GROUP_MEMBER_PENDING', () => {
    expect(
      groupMember(initialState, {
        type: constants.REMOVE_GROUP_MEMBER_PENDING
      }).toJSON()
    ).toEqual(
      {
        error: null,
        loading: true,
        requesting: false,
        isRemove: false,
        groupId: null,
        groupName: null,
        userId: null,
        userDisplayName: null
      }
    );
  });

  it('should handle REMOVE_GROUP_MEMBER_REJECTED', () => {
    expect(
      groupMember(initialState, {
        type: constants.REMOVE_GROUP_MEMBER_REJECTED,
        errorMessage: 'ERROR'
      }).toJSON()
    ).toEqual(
      {
        error: 'An error occured while removing the user: ERROR',
        loading: false,
        requesting: false,
        isRemove: false,
        groupId: null,
        groupName: null,
        userId: null,
        userDisplayName: null
      }
    );
  });

  it('should handle REMOVE_GROUP_MEMBER_FULFILLED', () => {
    expect(
      groupMember(initialState, {
        type: constants.REMOVE_GROUP_MEMBER_FULFILLED
      }).toJSON()
    ).toEqual(
      initialState
    );
  });
});
