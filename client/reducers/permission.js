import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: Map(),
  permissionId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: Map()
};

export const permission = createReducer(fromJS(initialState), {
  [constants.CLEAR_PERMISSION]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_PERMISSION]: (state) =>
    state.merge({
      ...initialState,
      isNew: true
    }),
  [constants.EDIT_PERMISSION]: (state, action) =>
    state.merge({
      ...initialState,
      isEdit: true,
      record: action.payload.permission,
      permissionId: action.payload.permission.name
    }),
  [constants.SAVE_PERMISSION_PENDING]: (state) =>
    state.merge({
      loading: true,
      validationErrors: Map()
    }),
  [constants.SAVE_PERMISSION_REJECTED]: (state, action) => {
    const validationErrors = action.payload.data && action.payload.data.errors && Map(action.payload.data.errors) || Map();
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      validationErrors: validationErrors,
      error: `An error occured while saving the permission: ${errorMessage}`
    });
  },
  [constants.SAVE_PERMISSION_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUESTING_DELETE_PERMISSION]: (state, action) =>
    state.merge({
      isDelete: true,
      permissionId: action.payload.permission.name,
      requesting: true
    }),
  [constants.CANCEL_DELETE_PERMISSION]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_PERMISSION_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_PERMISSION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the permission: ${action.errorMessage}`
    }),
  [constants.DELETE_PERMISSION_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
