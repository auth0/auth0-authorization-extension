import * as constants from '../constants';
import axios from 'axios';

export function fetchPermissions(reload = false) {
  return (dispatch, getState) => {
    if (reload || !getState().permissions.get('records').size) {
      dispatch({
        type: constants.FETCH_PERMISSIONS,
        payload: {
          promise: axios.get('/api/permissions', {
            timeout: 5000,
            responseType: 'json'
          })
        }
      });
    }
  };
}

export function createPermission() {
  return {
    type: constants.CREATE_PERMISSION
  };
}

export function editPermission(permission) {
  return {
    type: constants.EDIT_PERMISSION,
    payload: {
      permission
    }
  };
}

export function savePermission(permission) {
  return (dispatch, getState) => {
    const state = getState().permission.toJS();
    dispatch({
      type: constants.SAVE_PERMISSION,
      payload: {
        promise: axios({
          method: state.isNew ? 'post' : 'put',
          url: state.isNew ? '/api/permissions' : `/api/permissions/${state.permissionId}`,
          data: permission,
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        isNew: state.isNew,
        permission: permission,
        permissionId: state.permissionId || permission.name
      }
    });
  };
}

export function requestingDeletePermission(permission) {
  return {
    type: constants.REQUESTING_DELETE_PERMISSION,
    payload: {
      permission
    }
  };
}

export function cancelDeletePermission() {
  return {
    type: constants.CANCEL_DELETE_PERMISSION
  };
}

export function deletePermission() {
  return (dispatch, getState) => {
    const permission = getState().permission.get('permission');
    const permissionId = getState().permission.get('permissionId');
    dispatch({
      type: constants.DELETE_PERMISSION,
      payload: {
        promise: axios.delete(`/api/permissions/${permissionId}`, {
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        permission,
        permissionId
      }
    });
  };
}

export function clearPermission() {
  return {
    type: constants.CLEAR_PERMISSION
  };
}
