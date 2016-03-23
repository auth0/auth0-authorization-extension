import * as constants from '../constants';
import axios from 'axios';

import { fetchUserLogs } from './userLog';
import { fetchUserGroups } from './userGroup';
import { fetchUserDevices } from './userDevice';

/*
 * Search for users.
 */
export function fetchUsers(search = '', reset = false, page = 0) {
  return (dispatch, getState) => {
    const users = getState().users.get('records');
    if (reset || search !== '' || !users.size) {
      dispatch({
        type: constants.FETCH_USERS,
        payload: {
          promise: axios.get('/api/users', {
            params: {
              search,
              page
            },
            timeout: 5000,
            responseType: 'json'
          })
        },
        meta: {
          page
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
        timeout: 5000,
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
        timeout: 5000,
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
    dispatch(fetchUserLogs(userId));
    dispatch(fetchUserGroups(userId));
    dispatch(fetchUserDevices(userId));
  };
}

/*
 * Get confirmation to remove MFA from a user.
 */
export function requestRemoveMultiFactor(user) {
  return {
    type: constants.REQUEST_REMOVE_MULTIFACTOR,
    user
  };
}

/*
 * Cancel the removal process.
 */
export function cancelRemoveMultiFactor() {
  return {
    type: constants.CANCEL_REMOVE_MULTIFACTOR
  };
}

/*
 * Remove multi factor from a user.
 */
export function removeMultiFactor(userId, provider) {
  return (dispatch, getState) => {
    const userId = getState().mfa.get('userId');
    dispatch({
      type: constants.REMOVE_MULTIFACTOR,
      payload: {
        promise: axios.delete(`/api/users/${userId}/multifactor/${provider}`, {
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        userId
      }
    });
  };
}

/*
 * Get confirmation to block a user.
 */
export function requestBlockUser(user) {
  return {
    type: constants.REQUEST_BLOCK_USER,
    user
  };
}

/*
 * Cancel blocking a user.
 */
export function cancelBlockUser() {
  return {
    type: constants.CANCEL_BLOCK_USER
  };
}

/*
 * Block a user.
 */
export function blockUser() {
  return (dispatch, getState) => {
    const userId = getState().block.get('userId');
    dispatch({
      type: constants.BLOCK_USER,
      payload: {
        promise: axios.post(`/api/users/${userId}/block`, {
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        userId
      }
    });
  };
}

/*
 * Get confirmation to unblock a user.
 */
export function requestUnblockUser(user) {
  return {
    type: constants.REQUEST_UNBLOCK_USER,
    user
  };
}

/*
 * Cancel unblocking a user.
 */
export function cancelUnblockUser() {
  return {
    type: constants.CANCEL_UNBLOCK_USER
  };
}

/*
 * Unblock a user.
 */
export function unblockUser() {
  return (dispatch, getState) => {
    const userId = getState().unblock.get('userId');
    dispatch({
      type: constants.UNBLOCK_USER,
      payload: {
        promise: axios.post(`/api/users/${userId}/unblock`, {
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        userId
      }
    });
  };
}
