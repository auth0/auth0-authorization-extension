import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  error: null,
  loading: false,
  requesting: false,
  isRemove: false,
  groupId: null,
  groupName: null,
  userId: null,
  userDisplayName: null
};

export const groupMember = createReducer(fromJS(initialState), {
  [constants.REQUEST_REMOVE_GROUP_MEMBER]: (state, action) =>
    state.merge({
      isRemove: true,
      groupId: action.meta.group._id,
      groupName: action.meta.group.name,
      userId: action.meta.user.user_id,
      userDisplayName: action.meta.user.user_name || action.meta.user.email,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_GROUP_MEMBER]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_GROUP_MEMBER_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_GROUP_MEMBER_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while removing the user: ${action.errorMessage}`
    }),
  [constants.REMOVE_GROUP_MEMBER_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
