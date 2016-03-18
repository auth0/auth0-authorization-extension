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
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}
