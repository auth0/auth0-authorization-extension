import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { },
  applicationId: null,
  groups: {
    loading: false,
    error: null,
    records: []
  }
};

const applicationGroups = createReducer(fromJS(initialState.groups), {
  [constants.FETCH_APPLICATION_GROUPS_PENDING]: (state, action) => {
    if (action.meta && action.meta.reload) {
      return state.merge({
        loading: true
      });
    }

    return state.merge({
      ...initialState.groups,
      loading: true
    });
  },
  [constants.FETCH_APPLICATION_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.groups,
      error: `An error occured while loading the groups: ${action.errorMessage}`
    }),
  [constants.FETCH_APPLICATION_GROUPS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(action.payload.data)
    }),
  [constants.ADD_APPLICATION_GROUPS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.ADD_APPLICATION_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while adding the groups: ${action.errorMessage}`
    }),
  [constants.ADD_APPLICATION_GROUPS_FULFILLED]: (state) =>
    state.merge({
      loading: false
    }),
  [constants.REMOVE_APPLICATION_GROUP_FULFILLED]: (state, action) => {
    const records = state.get('records');
    const index = records.findIndex((group) => group.get('_id') === action.meta.groupId);
    return state.merge({
      loading: false,
      records: records.delete(index)
    });
  }
});

export const application = createReducer(fromJS(initialState), {
  [constants.FETCH_APPLICATION_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      applicationId: action.meta.applicationId
    }),
  [constants.FETCH_APPLICATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the application: ${action.errorMessage}`
    }),
  [constants.FETCH_APPLICATION_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.client_id !== state.get('applicationId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  },
  [constants.FETCH_APPLICATION_GROUPS_PENDING]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    }),
  [constants.FETCH_APPLICATION_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    }),
  [constants.FETCH_APPLICATION_GROUPS_FULFILLED]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    }),
  [constants.ADD_APPLICATION_GROUPS_PENDING]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    }),
  [constants.ADD_APPLICATION_GROUPS_REJECTED]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    }),
  [constants.ADD_APPLICATION_GROUPS_FULFILLED]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    }),
  [constants.REMOVE_APPLICATION_GROUP_FULFILLED]: (state, action) =>
    state.merge({
      groups: applicationGroups(state.get('groups'), action)
    })
});
