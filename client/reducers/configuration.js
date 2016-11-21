import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
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
      record: { }
    }),
  [constants.FETCH_CONFIGURATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the configuration: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
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
      error: `An error occured while saving the configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_CONFIGURATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      record: fromJS(action.payload.data)
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
      error: `An error occured while loading the resource server configuration: ${action.errorMessage}`
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
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while saving the resource server configuration: ${errorMessage}`
    });
  },
  [constants.SAVE_CONFIGURATION_RESOURCESERVER_FULFILLED]: (state, action) =>
    state.merge({
      loading: false
    }),
  [constants.REMOVE_CONFIGURATION_RESOURCESERVER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_CONFIGURATION_RESOURCESERVER_REJECTED]: (state, action) => {
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      error: `An error occured while removing the resource server configuration: ${errorMessage}`
    });
  },
  [constants.REMOVE_CONFIGURATION_RESOURCESERVER_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      resourceserver: { }
    }),
  [constants.SET_CONFIGURATION_TAB]: (state, action) =>
    state.merge({
      activeTab: action.meta.activeTab
    }),
  [constants.FETCH_CONFIGURATION_EXPLORER_PENDING]: (state) =>
    state.merge({
      error: null,
      loading: true,
      explorer: { }
    }),
  [constants.FETCH_CONFIGURATION_EXPLORER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the api explorer configuration: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_EXPLORER_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      explorer: fromJS(action.payload.data)
    }),
});
