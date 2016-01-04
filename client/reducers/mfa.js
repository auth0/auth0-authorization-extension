import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  userId: null,
  userName: null
};

export const mfa = createReducer(fromJS(initialState), {
  [constants.REQUESTING_REMOVE_MULTIFACTOR]: (state, action) =>
    state.merge({
      userId: action.user.user_id,
      userName: action.user.user_name || action.user.email,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_MULTIFACTOR]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_MULTIFACTOR_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_MULTIFACTOR_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while unblocking the user: ${action.errorMessage}`
    }),
  [constants.REMOVE_MULTIFACTOR_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
