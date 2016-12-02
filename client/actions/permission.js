import axios from 'axios';
import _ from 'lodash';

import * as constants from '../constants';

/*
 * Load all available permissions.
 */
export function fetchPermissions(q = '', field = '') {
  return {
    type: constants.FETCH_PERMISSIONS,
    payload: {
      promise: axios.get('/api/permissions', {
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
 * Load the details of a single permission.
 */
export function fetchPermissionDetails(permissionId) {
  return {
    type: constants.FETCH_PERMISSION,
    meta: {
      permissionId
    },
    payload: {
      promise: axios.get(`/api/permissions/${permissionId}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Load a single permission.
 */
export function fetchPermission(permissionId) {
  return (dispatch) => {
    dispatch(fetchPermissionDetails(permissionId));
  };
}

/*
 * Create a new permission.
 */
export function createPermission() {
  return {
    type: constants.CREATE_PERMISSION
  };
}

/*
 * Edit a specific permission.
 */
export function editPermission(permission) {
  return {
    type: constants.EDIT_PERMISSION,
    payload: {
      permission
    }
  };
}

/*
 * Save the details of a permission (name, descripton)
 */
export function savePermission(permission) {
  const permissionData = _.pick(permission, [ 'applicationId', 'applicationType', 'description', 'name' ]);

  return (dispatch, getState) => {
    const state = getState().permission.toJS();
    dispatch({
      type: constants.SAVE_PERMISSION,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? '/api/permissions' : `/api/permissions/${state.permissionId}`,
          data: {
            applicationType: 'client',
            ...permissionData
          },
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        permissionData,
        permissionId: state.permissionId || permissionData.name
      }
    });
  };
}

/*
 * Request if we can delete the current permission?
 */
export function requestDeletePermission(permission) {
  return {
    type: constants.REQUEST_DELETE_PERMISSION,
    payload: {
      permission
    }
  };
}

/*
 * Cancel the delete process.
 */
export function cancelDeletePermission() {
  return {
    type: constants.CANCEL_DELETE_PERMISSION
  };
}

/*
 * Delete the permission.
 */
export function deletePermission(permission) {
  return {
    type: constants.DELETE_PERMISSION,
    payload: {
      promise: axios.delete(`/api/permissions/${permission._id}`, {
        responseType: 'json'
      })
    },
    meta: {
      permission,
      permissionId: permission._id
    }
  };
}

/*
 * Clear the selected permission.
 */
export function clearPermission() {
  return {
    type: constants.CLEAR_PERMISSION
  };
}
