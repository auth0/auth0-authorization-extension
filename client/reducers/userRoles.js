import { fromJS } from 'immutable';
import _ from 'lodash';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  deleting: false,
  records: [],
  allRoles: {
    loading: false,
    error: null,
    records: []
  },
  record: null,
  ids: []
};

const userAllRoles = createReducer(fromJS(initialState.allRoles), {
  [constants.FETCH_USER_ALL_ROLES_PENDING]: (state) =>
    state.merge({
      ...initialState.allRoles,
      loading: true
    }),
  [constants.FETCH_USER_ALL_ROLES_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.allRoles,
      error: `An error occured while loading all roles: ${action.errorMessage}`
    }),
  [constants.FETCH_USER_ALL_ROLES_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(action.payload.data || [])
    })
});

export const userRoles = createReducer(fromJS(initialState), {
  [constants.FETCH_USER_ROLES_PENDING]: (state) =>
    state.merge({
      ...initialState,
      loading: true
    }),
  [constants.FETCH_USER_ROLES_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the roles: ${action.errorMessage}`
    }),
  [constants.FETCH_USER_ROLES_FULFILLED]: (state, action) => {
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
  [constants.FETCH_USER_ALL_ROLES_PENDING]: (state, action) =>
    state.merge({
      allRoles: userAllRoles(state.get('allRoles'), action)
    }),
  [constants.FETCH_USER_ALL_ROLES_REJECTED]: (state, action) =>
    state.merge({
      allRoles: userAllRoles(state.get('allRoles'), action)
    }),
  [constants.FETCH_USER_ALL_ROLES_FULFILLED]: (state, action) =>
    state.merge({
      allRoles: userAllRoles(state.get('allRoles'), action)
    }),
  [constants.REQUEST_DELETE_USER_ROLE]: (state, action) =>
    state.merge({
      deleting: true,
      record: action.meta.role
    }),
  [constants.CANCEL_DELETE_USER_ROLE]: (state) =>
    state.merge({
      deleting: false,
      record: null
    }),
  [constants.DELETE_USER_ROLE_PENDING]: (state) =>
    state.merge({
      ...initialState,
      deleting: true,
      loading: true
    }),
  [constants.DELETE_USER_ROLE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      deleting: false,
      error: `An error occured while deleting the role: ${action.errorMessage}`
    }),
  [constants.DELETE_USER_ROLE_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      deleting: false,
      record: null
    })
});
