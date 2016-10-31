import axios from 'axios';

import * as constants from '../constants';

import { parseHash, isTokenExpired, decodeToken } from '../utils/auth';
import { show } from '../utils/lock';

export function login(returnUrl) {
  show(returnUrl);

  return {
    type: constants.SHOW_LOGIN
  };
}

export function logout() {
  return (dispatch) => {
    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const token = sessionStorage.getItem('authz:apiToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (isTokenExpired(decodedToken)) {
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      dispatch({
        type: constants.RECIEVED_TOKEN,
        payload: {
          token
        }
      });

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token,
          decodedToken,
          user: decodedToken
        }
      });

      return;
    }
  };
}
