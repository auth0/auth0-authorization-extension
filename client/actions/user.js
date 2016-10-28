import axios from 'axios';
import * as constants from '../constants';

import { fetchUserGroups } from './userGroup';

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
      dispatch(fetchUserAuthorization(payload.data));
    }));
    dispatch(fetchUserGroups(userId));
  };
}
