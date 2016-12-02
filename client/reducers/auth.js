import url from 'url';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  issuer: null,
  token: null,
  decodedToken: null,
  user: null
};

export const auth = createReducer(fromJS(initialState), {
  [constants.LOGIN_PENDING]: (state) =>
    state.merge({
      ...initialState,
      isAuthenticating: true
    }),
  [constants.LOGIN_FAILED]: (state, action) =>
    state.merge({
      isAuthenticating: false,
      error: action.payload.error || 'Unknown Error'
    }),
  [constants.LOGIN_SUCCESS]: (state, action) =>
    state.merge({
      isAuthenticated: true,
      isAuthenticating: false,
      user: action.payload.user,
      token: action.payload.token,
      decodedToken: action.payload.decodedToken,
      issuer: url.parse(action.payload.decodedToken.iss).hostname
    }),
  [constants.LOGOUT_SUCCESS]: (state) =>
    state.merge({
      user: null,
      token: null,
      decodedToken: null,
      isAuthenticated: false
    })
});
