import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';

import * as constants from '../constants';
import { show, parseHash, getProfile } from '../utils/lock';

export function login(returnUrl) {
  show(returnUrl);

  return {
    type: constants.SHOW_LOGIN
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('apiToken');
    sessionStorage.removeItem('apiToken');

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    if (window.location.hash) {
      const hash = parseHash(window.location.hash);
      if (hash && hash.id_token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${hash.id_token}`;

        dispatch({
          type: constants.RECIEVED_TOKEN,
          payload: {
            id_token: hash.id_token
          }
        });

        dispatch({
          type: constants.LOGIN_PENDING
        });

        getProfile(hash.id_token, (err, profile) => {
          if (err) {
            return dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: err.message
              }
            });
          }

          localStorage.setItem('apiToken', hash.id_token);
          localStorage.setItem('userProfile', JSON.stringify(profile));

          setToken(dispatch, hash.id_token, profile);

          if (hash.state) {
            dispatch(push(hash.state));
          }
        });

        return;
      }
    }

    const id_token = localStorage.getItem('apiToken');
    const profile = localStorage.getItem('userProfile');
    if (id_token && profile) {
      setToken(dispatch, id_token, JSON.parse(profile));
      return;
    }

    // Webtask support.
    const apiToken = sessionStorage.getItem('apiToken');
    if (apiToken) {
      setToken(dispatch, apiToken);
      return;
    }
  };
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}


function setToken(dispatch, token, profile) {
  const decodedToken = jwtDecode(token);
  if (isExpired(decodedToken)) {
    return;
  }

  axios.defaults.headers.common.Authorization = `Bearer ${token}`;

  dispatch({
    type: constants.LOADED_TOKEN,
    payload: {
      token
    }
  });

  dispatch({
    type: constants.LOGIN_SUCCESS,
    payload: {
      token,
      decodedToken,
      user: profile || decodedToken
    }
  });
}
