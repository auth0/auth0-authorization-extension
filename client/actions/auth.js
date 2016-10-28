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
    localStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    if (window.location.hash || localStorage.getItem('apiToken')) {
      const hash = parseHash(window.location.hash);
      let accessToken = null;

      if (hash && hash.accessToken) {
        accessToken = hash.accessToken;
      } else if (localStorage.getItem('apiToken')) {
        accessToken = localStorage.getItem('apiToken');
      }

      if (accessToken) {
        const decodedToken = decodeToken(accessToken);
        if (isTokenExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        localStorage.setItem('apiToken', accessToken);

        dispatch({
          type: constants.RECIEVED_TOKEN,
          payload: {
            token: accessToken
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: accessToken,
            decodedToken,
            user: decodedToken
          }
        });
      }
    }
  };
}
