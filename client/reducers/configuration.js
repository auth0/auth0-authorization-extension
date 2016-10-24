import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { }
};

export const configuration = createReducer(fromJS(initialState), {
  [constants.FETCH_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
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
    })
});
