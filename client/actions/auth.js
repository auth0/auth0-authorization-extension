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
    if (window.location.hash) {
      const hash = parseHash(window.location.hash);
      if (hash && hash.accessToken) {
        const decodedToken = decodeToken(hash.accessToken);
        if (isTokenExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${hash.accessToken}`;

        dispatch({
          type: constants.RECIEVED_TOKEN,
          payload: {
            token: hash.access_token
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: hash.access_token,
            decodedToken,
            user: decodedToken
          }
        });

        return;
      }
    }
  };
}
