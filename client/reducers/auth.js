import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  token: null,
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
      token: action.payload.id_token
    }),
  [constants.LOGOUT_SUCCESS]: (state) =>
    state.merge({
      user: null,
      token: null,
      isAuthenticated: false
    })
});
