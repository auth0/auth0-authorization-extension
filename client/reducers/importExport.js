import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: {},
  requesting: false,
  preview: {}
};

export const importExport = createReducer(fromJS(initialState), {
  [constants.FETCH_CONFIGURATION_EXPORT_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_CONFIGURATION_EXPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the config: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_EXPORT_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.payload.data),
      requesting: false
    }),
  [constants.FETCH_CONFIGURATION_IMPORT_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_CONFIGURATION_IMPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while updating the config: ${action.errorMessage}`,
      requesting: false
    }),
  [constants.FETCH_CONFIGURATION_IMPORT_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.meta.config),
      requesting: false
    }),
  [constants.FETCH_CONFIGURATION_ADD_ERROR]: (state, action) =>
    state.merge({
      loading: false,
      error: action.meta.error,
      requesting: false
    }),
  [constants.FETCH_CONFIGURATION_CLOSE_ERROR]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      requesting: false
    }),
  [constants.OPEN_CONFIGURATION_PREVIEW]: (state, action) =>
    state.merge({
      loading: false,
      preview: action.meta.preview,
      error: null,
      requesting: true
    }),
  [constants.CLOSE_CONFIGURATION_PREVIEW]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      requesting: false,
      preview: {}
    })
});
