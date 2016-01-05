import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: Map(),
  roleId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: Map()
};

export const role = createReducer(fromJS(initialState), {
  [constants.CLEAR_ROLE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_ROLE]: (state) =>
    state.merge({
      ...initialState,
      isNew: true
    }),
  [constants.EDIT_ROLE]: (state, action) =>
    state.merge({
      ...initialState,
      isEdit: true,
      record: action.payload.role,
      roleId: action.payload.role.name
    }),
  [constants.SAVE_ROLE_PENDING]: (state) =>
    state.merge({
      loading: true,
      validationErrors: Map()
    }),
  [constants.SAVE_ROLE_REJECTED]: (state, action) => {
    const validationErrors = action.payload.data && action.payload.data.errors && Map(action.payload.data.errors) || Map();
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      validationErrors: validationErrors,
      error: `An error occured while saving the role: ${errorMessage}`
    });
  },
  [constants.SAVE_ROLE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUESTING_DELETE_ROLE]: (state, action) =>
    state.merge({
      isDelete: true,
      roleId: action.payload.role.name,
      requesting: true
    }),
  [constants.CANCEL_DELETE_ROLE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_ROLE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_ROLE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the role: ${action.errorMessage}`
    }),
  [constants.DELETE_ROLE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
