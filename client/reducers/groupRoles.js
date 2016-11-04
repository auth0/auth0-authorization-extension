import { fromJS } from 'immutable';
import _ from 'lodash';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  deleting: false,
  records: [],
  record: null,
  ids: []
};

export const groupRoles = createReducer(fromJS(initialState), {
  [constants.FETCH_GROUP_ROLES_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_GROUP_ROLES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the roles: ${action.errorMessage}`
    }),
  [constants.FETCH_GROUP_ROLES_FULFILLED]: (state, action) => {
    const data = action.payload.data;
    let roles = [];
    if (data && data.length) {
      roles = _.map(data, (role) => (role._id));
    }
    return state.merge({
      loading: false,
      records: fromJS(data),
      ids: roles
    });
  },
  [constants.REQUEST_DELETE_GROUP_ROLE]: (state, action) =>
    state.merge({
      deleting: true,
      record: action.meta.role
    }),
  [constants.CANCEL_DELETE_GROUP_ROLE]: (state) =>
    state.merge({
      deleting: false,
      record: null
    }),
  [constants.DELETE_GROUP_ROLE_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.DELETE_GROUP_ROLE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      deleting: false,
      error: `An error occured while deleting the role: ${action.errorMessage}`
    }),
  [constants.DELETE_GROUP_ROLE_FULFILLED]: (state) =>
    state.merge({
      deleting: false,
      record: null
    })
});
