import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
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
      records: fromJS(action.payload.data)
    }),
  [constants.REMOVE_APPLICATION_GROUP_FULFILLED]: (state, action) => {
    const apps = state.get('records');
    const applicationIndex = apps.findIndex((app) => app.get('client_id') === action.meta.applicationId);
    if (applicationIndex === -1) {
      return state;
    }

    const groups = apps.get(applicationIndex).get('groups');
    const groupIndex = groups.findIndex((group) => group.get('_id') === action.meta.groupId);
    if (groupIndex === -1) {
      return state;
    }

    return state.updateIn(
      [ 'records', state.get('records').findIndex(app => app.get('client_id') === action.meta.applicationId), 'groups' ],
      (applicationGroups) => applicationGroups.splice(groupIndex, 1)
    );
  }
});
