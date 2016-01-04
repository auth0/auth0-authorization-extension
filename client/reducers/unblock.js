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

export const unblock = createReducer(fromJS(initialState), {
  [constants.REQUESTING_UNBLOCK_USER]: (state, action) =>
    state.merge({
      userId: action.user.user_id,
      userName: action.user.user_name || action.user.email,
      requesting: true
    }),
  [constants.CANCEL_UNBLOCK_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.UNBLOCK_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.UNBLOCK_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while unblocking the user: ${action.errorMessage}`
    }),
  [constants.UNBLOCK_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
