import * as constants from '../constants';
import axios from 'axios';

export function fetchUsers(search = '', reset = false, page = 0) {
  return (dispatch, getState) => {
    const users = getState().users.get('records');
    if (reset || search != '' || !users.size) {
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

export function fetchUser(userId) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_USER,
      meta: {
        userId
      },
      payload: {
        promise: axios.get(`/api/users/${userId}`, {
          timeout: 5000,
          responseType: 'json'
        })
      }
    });

    dispatch({
      type: constants.FETCH_USER_LOGS,
      meta: {
        userId
      },
      payload: {
        promise: axios.get(`/api/users/${userId}/logs`, {
          timeout: 5000,
          responseType: 'json'
        })
      }
    });

    dispatch({
      type: constants.FETCH_USER_DEVICES,
      meta: {
        userId
      },
      payload: {
        promise: axios.get(`/api/users/${userId}/devices`, {
          timeout: 5000,
          responseType: 'json'
        })
      }
    });
  };
}

export function requestingRemoveMultiFactor(user) {
  return {
    type: constants.REQUESTING_REMOVE_MULTIFACTOR,
    user
  };
}

export function cancelRemoveMultiFactor() {
  return {
    type: constants.CANCEL_REMOVE_MULTIFACTOR
  };
}

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

export function requestingBlockUser(user) {
  return {
    type: constants.REQUESTING_BLOCK_USER,
    user
  };
}

export function cancelBlockUser() {
  return {
    type: constants.CANCEL_BLOCK_USER
  };
}

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

export function requestingUnblockUser(user) {
  return {
    type: constants.REQUESTING_UNBLOCK_USER,
    user
  };
}

export function cancelUnblockUser() {
  return {
    type: constants.CANCEL_UNBLOCK_USER
  };
}

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
