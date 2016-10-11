import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { },
  groupMappingId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: { }
};

export const groupMapping = createReducer(fromJS(initialState), {
  [constants.CLEAR_GROUP_MAPPING]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_GROUP_MAPPING]: (state) =>
    state.merge({
      ...initialState,
      isNew: true
    }),
  [constants.EDIT_GROUP_MAPPING]: (state, action) =>
    state.merge({
      ...initialState,
      isEdit: true,
      record: action.payload.groupMapping,
      groupMappingId: action.payload.groupMapping._id
    }),
  [constants.SAVE_GROUP_MAPPING_PENDING]: (state) =>
    state.merge({
      loading: true,
      validationErrors: Map()
    }),
  [constants.SAVE_GROUP_MAPPING_REJECTED]: (state, action) => {
    const validationErrors = (action.payload.data && action.payload.data.errors && Map(action.payload.data.errors)) || Map();
    const errorMessage = action.payload.data ? action.payload.data.errors : (action.errorMessage || 'Validation Error');

    return state.merge({
      loading: false,
      validationErrors: validationErrors,
      error: `An error occured while saving the mapping: ${errorMessage}`
    });
  },
  [constants.SAVE_GROUP_MAPPING_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUEST_DELETE_GROUP_MAPPING]: (state, action) =>
    state.merge({
      isDelete: true,
      record: action.payload.groupMapping,
      groupMappingId: action.payload.groupMapping._id,
      requesting: true
    }),
  [constants.CANCEL_DELETE_GROUP_MAPPING]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_GROUP_MAPPING_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_GROUP_MAPPING_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the mapping: ${action.errorMessage}`
    }),
  [constants.DELETE_GROUP_MAPPING_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
