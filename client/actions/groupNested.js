import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the nested of a single group.
 */
export function fetchNestedGroups(groupId, reload) {
  return {
    type: constants.FETCH_GROUP_NESTED,
    meta: {
      groupId,
      reload
    },
    payload: {
      promise: axios.get(`/api/groups/${groupId}/nested`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Add the selected group to a group.
 */
export function addNestedGroup(groupId, nestedGroupId, callback) {
  return (dispatch) => {
    dispatch({
      type: constants.ADD_GROUP_NESTED,
      payload: {
        promise: axios({
          method: 'patch',
          url: `/api/groups/${groupId}/nested`,
          data: [ nestedGroupId ],
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
 * Request if it's ok to remove a nested group.
 */
export function requestRemoveNestedGroup(group, nestedGroup) {
  return {
    type: constants.REQUEST_REMOVE_GROUP_NESTED,
    meta: {
      group,
      nestedGroup
    }
  };
}

/*
 * Cancel the remove process.
 */
export function cancelRemoveNestedGroup() {
  return {
    type: constants.CANCEL_REMOVE_GROUP_NESTED
  };
}

/*
 * Remove a nested group from the group.
 */
export function removeNestedGroup(groupId, nestedGroupId) {
  return {
    type: constants.REMOVE_GROUP_NESTED,
    payload: {
      promise: axios({
        method: 'delete',
        url: `/api/groups/${groupId}/nested`,
        data: {
          groupId: nestedGroupId
        },
        responseType: 'json'
      })
    },
    meta: {
      groupId,
      nestedGroupId
    }
  };
}
