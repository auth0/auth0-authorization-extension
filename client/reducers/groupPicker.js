import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  open: false,
  records: [],
  title: 'Select a group.'
};

export const groupPicker = createReducer(fromJS(initialState), {
  [constants.OPEN_GROUP_PICKER]: (state, action) =>
    state.merge({
      ...initialState,
      open: true,
      title: action.payload.title
    }),
  [constants.LOAD_GROUP_PICKER_PENDING]: (state) =>
    state.merge({
      loading: true,
      records: []
    }),
  [constants.LOAD_GROUP_PICKER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the groups: ${action.errorMessage}`
    }),
  [constants.LOAD_GROUP_PICKER_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(action.payload.data)
    }),
  [constants.CANCEL_GROUP_PICKER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CONFIRM_GROUP_PICKER]: (state) =>
    state.merge({
      loading: true
    })
});
