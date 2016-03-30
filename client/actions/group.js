import axios from 'axios';

import * as constants from '../constants';
import { fetchGroupMembers } from './groupMember';
import { fetchGroupMappings } from './groupMapping';
import { fetchNestedGroups } from './groupNested';

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
 * Load a single group.
 */
export function fetchGroup(groupId) {
  return (dispatch) => {
    dispatch(fetchGroupDetails(groupId));
    dispatch(fetchGroupMembers(groupId));
    dispatch(fetchGroupMappings(groupId));
    dispatch(fetchNestedGroups(groupId));
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
