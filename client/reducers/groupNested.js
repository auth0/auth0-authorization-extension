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
  nestedGroupId: null,
  nestedGroupName: null
};

export const groupNested = createReducer(fromJS(initialState), {
  [constants.REQUEST_REMOVE_GROUP_NESTED]: (state, action) =>
    state.merge({
      isRemove: true,
      groupId: action.meta.group._id,
      groupName: action.meta.group.name,
      nestedGroupId: action.meta.nestedGroup._id,
      nestedGroupName: action.meta.nestedGroup.name,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_GROUP_NESTED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_GROUP_NESTED_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_GROUP_NESTED_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while removing the nested group: ${action.errorMessage}`
    }),
  [constants.REMOVE_GROUP_NESTED_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
