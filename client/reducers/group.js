import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: Map(),
  groupId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: Map()
};

export const group = createReducer(fromJS(initialState), {
  [constants.CLEAR_GROUP]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_GROUP]: (state) =>
    state.merge({
      ...initialState,
      isNew: true
    }),
  [constants.EDIT_GROUP]: (state, action) =>
    state.merge({
      ...initialState,
      isEdit: true,
      record: action.payload.group,
      groupId: action.payload.group.name
    }),
  [constants.SAVE_GROUP_PENDING]: (state) =>
    state.merge({
      loading: true,
      validationErrors: Map()
    }),
  [constants.SAVE_GROUP_REJECTED]: (state, action) => {
    const validationErrors = action.payload.data && action.payload.data.errors && Map(action.payload.data.errors) || Map();
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      validationErrors: validationErrors,
      error: `An error occured while saving the group: ${errorMessage}`
    });
  },
  [constants.SAVE_GROUP_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUESTING_DELETE_GROUP]: (state, action) =>
    state.merge({
      isDelete: true,
      groupId: action.payload.group.name,
      requesting: true
    }),
  [constants.CANCEL_DELETE_GROUP]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_GROUP_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_GROUP_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the group: ${action.errorMessage}`
    }),
  [constants.DELETE_GROUP_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
