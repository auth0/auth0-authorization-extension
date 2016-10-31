import axios from 'axios';

import * as constants from '../constants';

import { isTokenExpired, decodeToken } from '../utils/auth';
import { show } from '../utils/lock';

export function login(returnUrl) {
  show(returnUrl);

  return {
    type: constants.SHOW_LOGIN
  };
}

export function logout() {
  return (dispatch) => {
    sessionStorage.removeItem('authz:apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const apiToken = sessionStorage.getItem('authz:token');
    if (apiToken) {
      const decodedToken = decodeToken(apiToken);
      if (isTokenExpired(decodedToken)) {
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

      sessionStorage.setItem('authz:token', apiToken);

      dispatch({
        type: constants.RECIEVED_TOKEN,
        payload: {
          token: apiToken
        }
      });

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token: apiToken,
          decodedToken,
          user: decodedToken
        }
      });
    }
  };
}
