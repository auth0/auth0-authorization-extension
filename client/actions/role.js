import * as constants from '../constants';
import axios from 'axios';

export function fetchRoles(reload = false) {
  return (dispatch, getState) => {
    if (reload || !getState().roles.get('records').size) {
      dispatch({
        type: constants.FETCH_ROLES,
        payload: {
          promise: axios.get('/api/roles', {
            timeout: 5000,
            responseType: 'json'
          })
        }
      });
    }
  };
}

/*
 * Create a role.
 */
export function createRole() {
  return {
    type: constants.CREATE_ROLE
  };
}

/*
 * Edit a role.
 */
export function editRole(role) {
  return {
    type: constants.EDIT_ROLE,
    payload: {
      role
    }
  };
}

export function saveRole(role) {
  return (dispatch, getState) => {
    const state = getState().role.toJS();
    dispatch({
      type: constants.SAVE_ROLE,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? '/api/roles' : `/api/roles/${state.roleId}`,
          data: role,
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        role: role,
        roleId: state.roleId || role.name
      }
    });
  };
}

/*
 * Get confirmation to delete a role.
 */
export function requestDeleteRole(role) {
  return {
    type: constants.REQUEST_DELETE_ROLE,
    payload: {
      role
    }
  };
}

/*
 * Cancel deleting a role.
 */
export function cancelDeleteRole() {
  return {
    type: constants.CANCEL_DELETE_ROLE
  };
}

/*
 * Delete a role.
 */
export function deleteRole() {
  return (dispatch, getState) => {
    const role = getState().role.get('role');
    const roleId = getState().role.get('roleId');
    dispatch({
      type: constants.DELETE_ROLE,
      payload: {
        promise: axios.delete(`/api/roles/${roleId}`, {
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        role,
        roleId
      }
    });
  };
}

/*
 * Clear the current role.
 */
export function clearRole() {
  return {
    type: constants.CLEAR_ROLE
  };
}
