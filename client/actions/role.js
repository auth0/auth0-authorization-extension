import axios from 'axios';
import _ from 'lodash';

import * as constants from '../constants';

/*
 * Load all available roles.
 */
export function fetchRoles() {
  return {
    type: constants.FETCH_ROLES,
    payload: {
      promise: axios.get('/api/roles', {
        responseType: 'json'
      })
    }
  };
}

/*
 * Load the details of a single role.
 */
export function fetchRoleDetails(roleId) {
  return {
    type: constants.FETCH_ROLE,
    meta: {
      roleId
    },
    payload: {
      promise: axios.get(`/api/roles/${roleId}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Load a single role.
 */
export function fetchRole(roleId) {
  return (dispatch) => {
    dispatch(fetchRoleDetails(roleId));
  };
}

/*
 * Create a new role.
 */
export function createRole() {
  return {
    type: constants.CREATE_ROLE
  };
}

export function roleApplicationSelected(applicationId) {
  return {
    type: constants.ROLE_APPLICATION_SELECTED,
    payload: {
      applicationId
    }
  };
}

/*
 * Edit a specific role.
 */
export function editRole(role) {
  return {
    type: constants.EDIT_ROLE,
    payload: {
      role
    }
  };
}

/*
 * Save the details of a role (name, descripton)
 */
export function saveRole(role) {
  const roleData = _.pick(role, [ 'applicationId', 'applicationType', 'description', 'name', 'permissions' ]);

  return (dispatch, getState) => {
    const state = getState().role.toJS();
    dispatch({
      type: constants.SAVE_ROLE,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? '/api/roles' : `/api/roles/${state.roleId}`,
          data: {
            applicationType: 'client',
            ...roleData
          },
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        roleData,
        roleId: state.roleId || roleData.name
      }
    });
  };
}

/*
 * Request if we can delete the current role?
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
 * Cancel the delete process.
 */
export function cancelDeleteRole() {
  return {
    type: constants.CANCEL_DELETE_ROLE
  };
}

/*
 * Delete the role.
 */
export function deleteRole(role) {
  return {
    type: constants.DELETE_ROLE,
    payload: {
      promise: axios.delete(`/api/roles/${role._id}`, {
        responseType: 'json'
      })
    },
    meta: {
      role,
      roleId: role._id
    }
  };
}

/*
 * Clear the selected role.
 */
export function clearRole() {
  return {
    type: constants.CLEAR_ROLE
  };
}
