import * as constants from '../constants';
import axios from 'axios';

export function fetchGroups(reload = false) {
  return (dispatch, getState) => {
    if (reload || !getState().groups.get('records').size) {
      dispatch({
        type: constants.FETCH_GROUPS,
        payload: {
          promise: axios.get('/api/groups', {
            timeout: 5000,
            responseType: 'json'
          })
        }
      });
    }
  };
}

export function fetchGroupMembers(groupId) {
  return {
    type: constants.FETCH_GROUP_MEMBERS,
    meta: {
      groupId
    },
    payload: {
      promise: axios.get(`/api/groups/${groupId}/members`, {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

export function fetchGroup(groupId) {
  return (dispatch) => {
    dispatch({
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
    });

    dispatch(fetchGroupMembers(groupId));
  };
}

export function createGroup() {
  return {
    type: constants.CREATE_GROUP
  };
}

export function editGroup(group) {
  return {
    type: constants.EDIT_GROUP,
    payload: {
      group
    }
  };
}

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
        group: group,
        groupId: state.groupId || group.name
      }
    });
  };
}

export function requestingDeleteGroup(group) {
  return {
    type: constants.REQUESTING_DELETE_GROUP,
    payload: {
      group
    }
  };
}

export function cancelDeleteGroup() {
  return {
    type: constants.CANCEL_DELETE_GROUP
  };
}

export function deleteGroup(group) {
  return (dispatch, getState) => {
    dispatch({
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
    });
  };
}

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
          dispatch(fetchGroupMembers(groupId));
        }
      }
    });
  };
}

export function requestRemoveGroupMember(group, user) {
  return {
    type: constants.REQUESTING_REMOVE_GROUP_MEMBER,
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
