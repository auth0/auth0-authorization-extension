import moment from 'moment';
import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux'

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { },
  groupId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: { },
  members: {
    loading: false,
    error: null,
    records: []
  },
  mappings: {
    loading: false,
    error: null,
    records: []
  }
};

export const group = createReducer(fromJS(initialState), {
  [constants.FETCH_GROUP_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      groupId: action.meta.groupId
    }),
  [constants.FETCH_GROUP_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the user: ${action.errorMessage}`
    }),
  [constants.FETCH_GROUP_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data._id !== state.get('groupId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  },

  [constants.CLEAR_GROUP]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_GROUP]: (state) =>
    state.merge({
      ...initialState,
      isNew: true
    }),
  [constants.EDIT_GROUP]: (state, action) =>
    state.merge({
      ...initialState,
      isEdit: true,
      record: action.payload.group,
      groupId: action.payload.group._id
    }),
  [constants.SAVE_GROUP_PENDING]: (state) =>
    state.merge({
      loading: true,
      validationErrors: Map()
    }),
  [constants.SAVE_GROUP_REJECTED]: (state, action) => {
    const validationErrors = action.payload.data && action.payload.data.errors && Map(action.payload.data.errors) || Map();
    const errorMessage = action.payload.data && action.payload.data.errors && 'Validation Error' || action.errorMessage;

    return state.merge({
      loading: false,
      validationErrors: validationErrors,
      error: `An error occured while saving the group: ${errorMessage}`
    });
  },
  [constants.SAVE_GROUP_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUEST_DELETE_GROUP]: (state, action) =>
    state.merge({
      isDelete: true,
      record: action.payload.group,
      groupId: action.payload.group._id,
      requesting: true
    }),
  [constants.CANCEL_DELETE_GROUP]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_GROUP_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_GROUP_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the group: ${action.errorMessage}`
    }),
  [constants.DELETE_GROUP_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.FETCH_GROUP_MEMBERS_PENDING]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    }),
  [constants.FETCH_GROUP_MEMBERS_REJECTED]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    }),
  [constants.FETCH_GROUP_MEMBERS_FULFILLED]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    }),
  [constants.ADD_GROUP_MEMBERS_PENDING]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    }),
  [constants.ADD_GROUP_MEMBERS_REJECTED]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    }),
  [constants.ADD_GROUP_MEMBERS_FULFILLED]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    }),
  [constants.REMOVE_GROUP_MEMBER_FULFILLED]: (state, action) =>
    state.merge({
      members: groupMembers(state.get('members'), action)
    })
});

const groupMembers = createReducer(fromJS(initialState.members), {
  [constants.FETCH_GROUP_MEMBERS_PENDING]: (state, action) => {
    if (action.meta && action.meta.reload) {
      return state.merge({
        loading: true
      });
    }

    return state.merge({
      ...initialState.members,
      loading: true
    });
  },
  [constants.FETCH_GROUP_MEMBERS_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.members,
      error: `An error occured while loading the members: ${action.errorMessage}`
    }),
  [constants.FETCH_GROUP_MEMBERS_FULFILLED]: (state, action) => {
    return state.merge({
      loading: false,
      records: fromJS(action.payload.data.map(user => {
        user.last_login_relative = moment(user.last_login).fromNow();
        return user;
      }))
    });
  },
  [constants.ADD_GROUP_MEMBERS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.ADD_GROUP_MEMBERS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while adding the members: ${action.errorMessage}`
    }),
  [constants.ADD_GROUP_MEMBERS_FULFILLED]: (state) => {
    return state.merge({
      loading: false
    });
  },
  [constants.REMOVE_GROUP_MEMBER_FULFILLED]: (state, action) => {
    const records = state.get('records');
    const index = records.findIndex((user) => user.get('user_id') === action.meta.userId);
    return state.merge({
      loading: false,
      records: records.delete(index)
    });
  }
});
