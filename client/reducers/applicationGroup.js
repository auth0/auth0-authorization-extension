import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  applicationId: null,
  application: { },
  groupId: null,
  group: { },
  isNew: false,
  isEdit: false,
  isRemove: false,
  requesting: false,
  validationErrors: { }
};

export const applicationGroup = createReducer(fromJS(initialState), {
  [constants.CLEAR_APPLICATION_GROUP]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUEST_REMOVE_APPLICATION_GROUP]: (state, action) =>
    state.merge({
      isRemove: true,
      application: action.meta.application,
      applicationId: action.meta.application.client_id,
      group: action.meta.group,
      groupId: action.meta.group._id,
      requesting: true
    }),
  [constants.CANCEL_REMOVE_APPLICATION_GROUP]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REMOVE_APPLICATION_GROUP_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.REMOVE_APPLICATION_GROUP_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while removing the group: ${action.errorMessage}`
    }),
  [constants.REMOVE_APPLICATION_GROUP_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
