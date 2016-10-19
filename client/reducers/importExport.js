import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: {}
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
      record: fromJS(action.payload.data)
    }),
  [constants.FETCH_CONFIGURATION_IMPORT_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_CONFIGURATION_IMPORT_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while updating the config: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_IMPORT_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      record: fromJS(action.meta.config)
    })
});
