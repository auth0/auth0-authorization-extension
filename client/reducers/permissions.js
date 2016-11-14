import { fromJS } from 'immutable';
import _ from 'lodash';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: [],
  fetchQuery: null
};

export const permissions = createReducer(fromJS(initialState), {
  [constants.FETCH_PERMISSIONS_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_PERMISSIONS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the permissions: ${action.errorMessage}`
    }),
  [constants.FETCH_PERMISSIONS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(_.sortBy(action.payload.data, permission => permission.id)),
      fetchQuery: action.payload.config && action.payload.config.params ? action.payload.config.params.q : null
    }),

  [constants.SAVE_PERMISSION_FULFILLED]: (state, action) => {
    let records = state.get('records');
    const record = fromJS(action.payload.data);
    const index = records.findIndex((permission) => permission.get('_id') === action.meta.permissionId);
    if (index >= 0) {
      records = records.splice(index, 1, record);
    } else {
      records = records.unshift(record);
    }

    return state.merge({
      records
    });
  },

  [constants.DELETE_PERMISSION_FULFILLED]: (state, action) => {
    const records = state.get('records');
    const index = records.findIndex((permission) => permission.get('_id') === action.meta.permissionId);
    return state.merge({
      loading: false,
      records: records.delete(index)
    });
  }
});
