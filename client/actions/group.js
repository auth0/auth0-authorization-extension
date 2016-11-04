import axios from 'axios';
import _ from 'lodash';
import { push } from 'react-router-redux';
import * as constants from '../constants';
import { fetchGroupMembers, fetchGroupMembersNested } from './groupMember';
import { fetchGroupMappings } from './groupMapping';
import { fetchNestedGroups } from './groupNested';

/*
 * Load all available groups.
 */
export function fetchGroups(q = '', field = '') {
  return {
    type: constants.FETCH_GROUPS,
    payload: {
      promise: axios.get('/api/groups', {
        params: {
          q,
          field
        },
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
    dispatch(fetchGroupMembers(groupId, null, process.env.PER_PAGE));
    dispatch(fetchGroupMappings(groupId));
    dispatch(fetchNestedGroups(groupId));
    dispatch(fetchGroupMembersNested(groupId, null, process.env.PER_PAGE));
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
 * Edit a specific group users.
 */
export function editGroupUsers(group) {
  return {
    type: constants.EDIT_GROUP_USERS,
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
    const groupData = state.isNew ?
      _.pick(group, [ 'name', 'description', 'members' ]) :
      _.pick(group, [ 'name', 'description' ]);

    dispatch({
      type: constants.SAVE_GROUP,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? '/api/groups' : `/api/groups/${state.groupId}`,
          data: groupData,
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        groupData,
        groupId: state.groupId || groupData.name
      }
    });
  };
}

/**
 * update group from detail view
 * @param group
 * @param onSuccess
 * @returns {function(*, *)}
 */
export function updateGroup(group, onSuccess) {
  return (dispatch, getState) => {
    const state = getState().group.toJS();
    const groupData = _.pick(group, [ 'name', 'description' ]);

    dispatch({
      type: constants.UPDATE_GROUP,
      payload: {
        promise: axios({
          method: 'put',
          url: `/api/groups/${state.groupId}`,
          data: groupData,
          responseType: 'json'
        })
      },
      meta: {
        isNew: false,
        groupData,
        groupId: state.groupId || groupData.name,
        onSuccess
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
export function deleteGroup(group, onSuccess) {
  return {
    type: constants.DELETE_GROUP,
    payload: {
      promise: axios.delete(`/api/groups/${group._id}`, { // eslint-disable-line no-underscore-dangle
        responseType: 'json'
      })
    },
    meta: {
      group,
      groupId: group._id, // eslint-disable-line no-underscore-dangle
      onSuccess: onSuccess || null
    }
  };
}

/**
 * go back to groups
 * @returns {function(*)}
 */
export function goToGroups() {
  return (dispatch) => {
    dispatch(push('/groups'));
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

export function closeUpdate() {
  return {
    type: constants.CLOSE_UPDATE_GROUP
  };
}

export function closeDelete() {
  return {
    type: constants.CLOSE_DELETE_GROUP
  };
}

export function groupOpenAddRoles() {
  return {
    type: constants.GROUP_ADD_ROLES_OPEN
  };
}

export function groupCloseAddRoles() {
  return {
    type: constants.GROUP_ADD_ROLES_CLOSE
  };
}

export function saveGroupRoles(group, data, onSuccess) {
  return {
    type: constants.SAVE_GROUP_ROLES,
    payload: {
      promise: axios({
        method: 'patch',
        url: `/api/groups/${group._id}/roles`, // eslint-disable-line no-underscore-dangle
        data,
        responseType: 'json'
      })
    },
    meta: {
      onSuccess
    }
  };
}

export function fetchRolesForGroup(groupId) {
  return {
    type: constants.FETCH_GROUP_ROLES,
    payload: {
      promise: axios.get(`/api/groups/${groupId}/roles`, {
        params: {},
        responseType: 'json'
      })
    }
  };
}

export function requestDeleteGroupRole(role) {
  return {
    type: constants.REQUEST_DELETE_GROUP_ROLE,
    meta: {
      role
    }
  };
}

export function cancelDeleteGroupRole() {
  return {
    type: constants.CANCEL_DELETE_GROUP_ROLE
  };
}

export function deleteGroupRole(group, role, onSuccess) {
  return {
    type: constants.DELETE_GROUP_ROLE,
    payload: {
      promise: axios({
        method: 'delete',
        url: `/api/groups/${group._id}/roles`, // eslint-disable-line no-underscore-dangle
        data: [ role._id ], // eslint-disable-line no-underscore-dangle
        responseType: 'json'
      })
    },
    meta: {
      onSuccess
    }
  };
}
