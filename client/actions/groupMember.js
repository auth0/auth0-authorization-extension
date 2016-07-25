import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the members of a single group.
 */
export function fetchGroupMembers(groupId, reload) {
  return {
    type: constants.FETCH_GROUP_MEMBERS,
    meta: {
      groupId,
      reload
    },
    payload: {
      promise: axios.get(`/api/groups/${groupId}/members`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Load the nested users of a single group.
 */
export function fetchGroupMembersNested(groupId, reload) {
  return {
    type: constants.FETCH_GROUP_MEMBERS_NESTED,
    meta: {
      groupId,
      reload
    },
    payload: {
      promise: axios.get(`/api/groups/${groupId}/members/nested`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Add the selected users members to a group.
 */
export function addGroupMembers(groupId, members, callback) {
  return (dispatch) => {
    dispatch({
      type: constants.ADD_GROUP_MEMBERS,
      payload: {
        promise: axios({
          method: 'patch',
          url: `/api/groups/${groupId}/members`,
          data: members,
          responseType: 'json'
        })
      },
      meta: {
        groupId,
        onSuccess: callback
      }
    });
  };
}

/*
 * Request if it's ok to remove a member.
 */
export function requestRemoveGroupMember(group, user) {
  return {
    type: constants.REQUEST_REMOVE_GROUP_MEMBER,
    meta: {
      group,
      user
    }
  };
}

/*
 * Cancel the remove process.
 */
export function cancelRemoveGroupMember() {
  return {
    type: constants.CANCEL_REMOVE_GROUP_MEMBER
  };
}

/*
 * Remove a member from the group.
 */
export function removeGroupMember(groupId, userId) {
  return {
    type: constants.REMOVE_GROUP_MEMBER,
    payload: {
      promise: axios({
        method: 'delete',
        url: `/api/groups/${groupId}/members`,
        data: {
          userId
        },
        responseType: 'json'
      })
    },
    meta: {
      userId,
      groupId
    }
  };
}
