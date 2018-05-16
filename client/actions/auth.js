/* global localStorage sessionStorage */

import axios from 'axios';

import * as constants from '../constants';

import { isTokenExpired, decodeToken } from '../utils/auth';

export function login() {
  window.location.href = window.config.BASE_URL + '/login';

  return {
    type: constants.SHOW_LOGIN
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('authz:apiToken');
    sessionStorage.removeItem('authz:apiToken');
    window.location.href = window.config.BASE_URL + '/logout';

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const apiToken = localStorage.getItem('authz:apiToken') || sessionStorage.getItem('authz:apiToken');
    if (apiToken) {
      const decodedToken = decodeToken(apiToken);
      if (isTokenExpired(decodedToken)) {
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

      localStorage.setItem('authz:apiToken', apiToken);

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
