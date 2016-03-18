import axios from 'axios';
import * as constants from '../constants';

/*
 * Load user devices.
 */
export function fetchUserDevices(userId) {
  return {
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
  };
}
