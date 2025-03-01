import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  hash: null,
  record: { },
  resourceserver: { },
  explorer: { },
  activeTab: 1
};

export const configuration = createReducer(fromJS(initialState), {
  [constants.FETCH_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      error: null,
      loading: true,
      hash: null,
      record: { }
    }),
  [constants.FETCH_CONFIGURATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      hash: null,
      error: `An error occurred while loading the configuration: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      hash: null,
      record: fromJS(action.payload.data)
    }),
  [constants.SAVE_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SAVE_CONFIGURATION_REJECTED]: (state, action) => {
    const errorMessage = action.payload.data ? action.payload.data.errors : (action.errorMessage || 'Validation Error');

    return state.merge({
      loading: false,
      error: `An error occurred while saving the configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      record: fromJS(action.payload.data)
    }),
  [constants.ROTATE_APIKEY_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.ROTATE_APIKEY_REJECTED]: (state, action) => {
    const errorMessage = action.payload.data ? action.payload.data.errors : (action.errorMessage || 'Validation Error');

    return state.merge({
      loading: false,
      error: `An error occurred while updating apiKey: ${errorMessage}`
    });
  },
  [constants.ROTATE_APIKEY_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      hash: fromJS(action.payload.data.hash)
    }),
  [constants.FETCH_CONFIGURATION_RESOURCESERVER_PENDING]: (state) =>
    state.merge({
      error: null,
      loading: true,
      resourceserver: { }
    }),
  [constants.FETCH_CONFIGURATION_RESOURCESERVER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the resource server configuration: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_RESOURCESERVER_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      resourceserver: fromJS(action.payload.data)
    }),
  [constants.SAVE_CONFIGURATION_RESOURCESERVER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.SAVE_CONFIGURATION_RESOURCESERVER_REJECTED]: (state, action) => {
    const errorMessage = (action.payload.data && action.payload.data.errors && 'Validation Error') || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occurred while saving the resource server configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_CONFIGURATION_RESOURCESERVER_FULFILLED]: (state) =>
    state.merge({
      loading: false
    }),
  [constants.REMOVE_CONFIGURATION_RESOURCESERVER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_CONFIGURATION_RESOURCESERVER_REJECTED]: (state, action) => {
    const errorMessage = (action.payload.data && action.payload.data.errors && 'Validation Error') || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occurred while removing the resource server configuration: ${errorMessage}`
    });
  },
  [constants.REMOVE_CONFIGURATION_RESOURCESERVER_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      resourceserver: { }
    }),
  [constants.SET_CONFIGURATION_TAB]: (state, action) =>
    state.merge({
      activeTab: action.meta.activeTab
    })
});
