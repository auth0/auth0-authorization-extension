import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { }
};

export const ruleStatus = createReducer(fromJS(initialState), {
  [constants.FETCH_RULE_STATUS]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_RULE_STATUS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the rule status: ${action.errorMessage}`
    }),
  [constants.FETCH_RULE_STATUS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      record: fromJS(action.payload.data)
    })
});
