import moment from 'moment';
import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  open: false,
  total: 0,
  records: [],
  selection: [],
  title: 'Select one or more users.'
};

export const userPicker = createReducer(fromJS(initialState), {
  [constants.OPEN_USER_PICKER]: (state, action) =>
    state.merge({
      ...initialState,
      open: true,
      title: action.payload.title
    }),
  [constants.SEARCH_USER_PICKER_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      records: action.meta.page === 0 ? [] : state.get('records')
    }),
  [constants.SEARCH_USER_PICKER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the users: ${action.errorMessage}`
    }),
  [constants.SEARCH_USER_PICKER_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      total: action.payload.data.total,
      nextPage: action.meta.page + 1,
      records: state.get('records').concat(fromJS(action.payload.data.users.map(user => {
        user.last_login_relative = moment(user.last_login).fromNow();
        return user;
      })))
    }),
  [constants.CANCEL_USER_PICKER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CONFIRM_USER_PICKER]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SELECT_USER]: (state, action) => {
    const selection = state.get('selection');
    const index = selection.findIndex((userId) => userId === action.payload.user.user_id);
    if (index >= 0) {
      return state;
    }

    return state.merge({
      selection: selection.unshift(action.payload.user.user_id)
    });
  },
  [constants.UNSELECT_USER]: (state, action) => {
    const selection = state.get('selection');
    const index = selection.findIndex((userId) => userId === action.payload.user.user_id);
    return state.merge({
      selection: selection.delete(index)
    });
  }
});
