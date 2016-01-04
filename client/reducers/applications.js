import { fromJS } from 'immutable';
import _ from 'lodash';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading : false,
  error: null,
  records: []
};

export const applications = createReducer(fromJS(initialState), {
  [constants.FETCH_APPLICATIONS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_APPLICATIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the applications: ${action.errorMessage}`
    }),
  [constants.FETCH_APPLICATIONS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      records: fromJS(_.sortBy(action.payload.data.applications, app => app.name))
    })
});
