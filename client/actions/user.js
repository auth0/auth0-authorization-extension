import axios from 'axios';
import * as constants from '../constants';

import { fetchUserGroups } from './userGroup';

/*
 * Search for users.
 */
export function fetchUsers(q = '', field = '', reset = false, per_page, page, onSuccess) { // eslint-disable-line camelcase
  return (dispatch, getState) => {
    const users = getState().users.get('records');
    if (reset || q !== '' || !users.size) {
      dispatch({
        type: constants.FETCH_USERS,
        payload: {
          promise: axios.get('/api/users', {
            params: {
              q,
              field,
              per_page,
              page
            },
            responseType: 'json'
          })
        },
        meta: {
          page,
          onSuccess
        }
      });
    }
  };
}

/*
 * Fetch the user details.
 */
export function fetchUserDetail(userId, onSuccess) {
  return {
    type: constants.FETCH_USER,
    meta: {
      userId,
      onSuccess
    },
    payload: {
      promise: axios.get(`/api/users/${userId}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Fetch user authorization.
 */
export function fetchUserAuthorization(user) {
  return {
    type: constants.FETCH_USER_AUTHORIZATION,
    meta: {
      userId: user.user_id
    },
    payload: {
      promise: axios({
        method: 'post',
        url: `/api/authorize/${user.user_id}`,
        data: {
          connectionName: user.identities[0].connection,
          groups: user.groups
        },
        responseType: 'json'
      })
    }
  };
}

/*
 * Fetch the complete user object.
 */
export function fetchUser(userId) {
  return (dispatch) => {
    dispatch(fetchUserDetail(userId, (payload) => {
      dispatch(fetchUserAuthorization(payload.data.user));
    }));
    dispatch(fetchUserGroups(userId));
  };
}

export function openAddRoles() {
  return {
    type: constants.ADD_ROLES_OPEN
  };
}

export function closeAddRoles() {
  return {
    type: constants.ADD_ROLES_CLOSE
  };
}

export function saveUserRoles(user, data, onSuccess) {
  return {
    type: constants.SAVE_USER_ROLES,
    payload: {
      promise: axios({
        method: 'patch',
        url: `/api/users/${user.user_id}/roles`,
        data,
        responseType: 'json'
      })
    },
    meta: {
      onSuccess
    }
  };
}

export function fetchRolesForUser(userId) {
  return {
    type: constants.FETCH_USER_ROLES,
    payload: {
      promise: axios.get(`/api/users/${userId}/roles`, {
        responseType: 'json'
      })
    }
  };
}

export function requestDeleteUserRole(role) {
  return {
    type: constants.REQUEST_DELETE_USER_ROLE,
    meta: {
      role
    }
  };
}

export function cancelDeleteUserRole() {
  return {
    type: constants.CANCEL_DELETE_USER_ROLE
  };
}

export function deleteUserRole(user, role, onSuccess) {
  return {
    type: constants.DELETE_USER_ROLE,
    payload: {
      promise: axios({
        method: 'delete',
        url: `/api/users/${user.user_id}/roles`,
        data: [ role._id ], // eslint-disable-line no-underscore-dangle
        responseType: 'json'
      })
    },
    meta: {
      onSuccess
    }
  };
}
