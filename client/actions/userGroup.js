import axios from 'axios';
import * as constants from '../constants';

/*
 * Load group memberships for a user.
 */
export function fetchUserGroups(userId) {
  return {
    type: constants.FETCH_USER_GROUPS,
    meta: {
      userId
    },
    payload: {
      promise: axios.get(`/api/users/${userId}/groups`, {
        responseType: 'json'
      })
    }
  };
}

export function fetchUserNestedGroups(userId) {
  return {
    type: constants.FETCH_USER_NESTED_GROUPS,
    meta: {
      userId
    },
    payload: {
      promise: axios.get(`/api/users/${userId}/groups/calculate`, {
        responseType: 'json'
      })
    }
  };
}
