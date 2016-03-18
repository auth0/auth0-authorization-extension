import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all available groups.
 */
export function fetchGroups() {
  return {
    type: constants.FETCH_GROUPS,
    payload: {
      promise: axios.get('/api/groups', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

/*
 * Load the details of a single group.
 */
export function fetchGroupDetails(groupId) {
  return {
    type: constants.FETCH_GROUP,
    meta: {
      groupId
    },
    payload: {
      promise: axios.get(`/api/groups/${groupId}`, {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

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
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

/*
 * Load the mappings of a single group.
 */
export function fetchGroupMappings(groupId) {
  return {
    type: constants.FETCH_GROUP_MAPPINGS,
    meta: {
      groupId
    },
    payload: {
      promise: axios.get(`/api/groups/${groupId}/mappings`, {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

/*
 * Load a single group.
 */
export function fetchGroup(groupId) {
  return (dispatch) => {
    dispatch(fetchGroupDetails(groupId));
    dispatch(fetchGroupMembers(groupId));
    dispatch(fetchGroupMappings(groupId));
  };
}

/*
 * Create a new group.
 */
export function createGroup() {
  return {
    type: constants.CREATE_GROUP
  };
}

/*
 * Edit a specific group.
 */
export function editGroup(group) {
  return {
    type: constants.EDIT_GROUP,
    payload: {
      group
    }
  };
}

/*
 * Save the details of a group (name, descripton)
 */
export function saveGroup(group) {
  return (dispatch, getState) => {
    const state = getState().group.toJS();
    dispatch({
      type: constants.SAVE_GROUP,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? '/api/groups' : `/api/groups/${state.groupId}`,
          data: group,
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        group,
        groupId: state.groupId || group.name
      }
    });
  };
}

/*
 * Request if we can delete the current group?
 */
export function requestDeleteGroup(group) {
  return {
    type: constants.REQUEST_DELETE_GROUP,
    payload: {
      group
    }
  };
}

/*
 * Cancel the delete process.
 */
export function cancelDeleteGroup() {
  return {
    type: constants.CANCEL_DELETE_GROUP
  };
}

/*
 * Delete the group.
 */
export function deleteGroup(group) {
  return {
    type: constants.DELETE_GROUP,
    payload: {
      promise: axios.delete(`/api/groups/${group._id}`, {
        timeout: 5000,
        responseType: 'json'
      })
    },
    meta: {
      group,
      groupId: group._id
    }
  };
}

/*
 * Clear the selected group.
 */
export function clearGroup() {
  return {
    type: constants.CLEAR_GROUP
  };
}

export function addGroupMembers() {
  return (dispatch, getState) => {
    const groupId = getState().group.get('groupId');
    const selection = getState().userPicker.get('selection').toJS();

    dispatch({
      type: constants.CANCEL_USER_PICKER
    });

    dispatch({
      type: constants.ADD_GROUP_MEMBERS,
      payload: {
        promise: axios({
          method: 'patch',
          url: `/api/groups/${groupId}/members`,
          data: selection,
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        groupId,
        onSuccess: () => {
          dispatch(fetchGroupMembers(groupId, true));
        }
      }
    });
  };
}

export function requestRemoveGroupMember(group, user) {
  return {
    type: constants.REQUEST_REMOVE_GROUP_MEMBER,
    meta: {
      group,
      user
    }
  };
}

export function cancelRemoveGroupMember() {
  return {
    type: constants.CANCEL_REMOVE_GROUP_MEMBER
  };
}

export function removeGroupMember(groupId, userId) {
  return (dispatch) => {
    dispatch({
      type: constants.REMOVE_GROUP_MEMBER,
      payload: {
        promise: axios({
          method: 'delete',
          url: `/api/groups/${groupId}/members`,
          data: {
            userId
          },
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        userId,
        groupId
      }
    });
  };
}
