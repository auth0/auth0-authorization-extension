import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  userId: null,
  record: { },
  allGroups: {
    loading: false,
    error: null,
    records: []
  },
  groups: {
    loading: false,
    error: null,
    records: []
  }
};

export const user = createReducer(fromJS(initialState), {
  [constants.FETCH_USER_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      userId: action.meta.userId
    }),
  [constants.FETCH_USER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the user: ${action.errorMessage}`
    }),
  [constants.FETCH_USER_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.user_id !== state.get('userId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  },
  [constants.FETCH_USER_GROUPS_PENDING]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.FETCH_USER_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.FETCH_USER_GROUPS_FULFILLED]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.ADD_GROUP_MEMBERS_PENDING]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.ADD_GROUP_MEMBERS_REJECTED]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.ADD_GROUP_MEMBERS_FULFILLED]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.REMOVE_GROUP_MEMBER_FULFILLED]: (state, action) =>
    state.merge({
      groups: userGroups(state.get('groups'), action)
    }),
  [constants.FETCH_USER_AUTHORIZATION_PENDING]: (state, action) =>
    state.merge({
      allGroups: userAllGroups(state.get('allGroups'), action)
    }),
  [constants.FETCH_USER_AUTHORIZATION_REJECTED]: (state, action) =>
    state.merge({
      allGroups: userAllGroups(state.get('allGroups'), action)
    }),
  [constants.FETCH_USER_AUTHORIZATION_FULFILLED]: (state, action) =>
    state.merge({
      allGroups: userAllGroups(state.get('allGroups'), action)
    })
});

const userGroups = createReducer(fromJS(initialState.groups), {
  [constants.FETCH_USER_GROUPS_PENDING]: (state) =>
    state.merge({
      ...initialState.groups,
      loading: true
    }),
  [constants.FETCH_USER_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.groups,
      error: `An error occured while loading the groups: ${action.errorMessage}`
    }),
  [constants.FETCH_USER_GROUPS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(action.payload.data)
    }),
  [constants.ADD_GROUP_MEMBERS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.ADD_GROUP_MEMBERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while adding the user: ${action.errorMessage}`
    }),
  [constants.ADD_GROUP_MEMBERS_FULFILLED]: (state) =>
    state.merge({
      loading: false
    }),
  [constants.REMOVE_GROUP_MEMBER_FULFILLED]: (state, action) => {
    const records = state.get('records');
    const index = records.findIndex((group) => group.get('_id') === action.meta.groupId);
    return state.merge({
      loading: false,
      records: records.delete(index)
    });
  }
});

const userAllGroups = createReducer(fromJS(initialState.allGroups), {
  [constants.FETCH_USER_AUTHORIZATION_PENDING]: (state) =>
    state.merge({
      ...initialState.allGroups,
      loading: true
    }),
  [constants.FETCH_USER_AUTHORIZATION_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.allGroups,
      error: `An error occured while loading all groups (authorization): ${action.errorMessage}`
    }),
  [constants.FETCH_USER_AUTHORIZATION_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(action.payload.data.groups || [])
    })
});
