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

export const block = createReducer(fromJS(initialState), {
  [constants.REQUEST_BLOCK_USER]: (state, action) =>
    state.merge({
      userId: action.user.user_id,
      userName: action.user.user_name || action.user.email,
      requesting: true
    }),
  [constants.CANCEL_BLOCK_USER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.BLOCK_USER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.BLOCK_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while blocking the user: ${action.errorMessage}`
    }),
  [constants.BLOCK_USER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
