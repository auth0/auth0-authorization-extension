import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { },
  roleId: null,
  isNew: false,
  isEdit: false,
  isDelete: false,
  requesting: false,
  validationErrors: { }
};

export const role = createReducer(fromJS(initialState), {
  [constants.FETCH_ROLE_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      roleId: action.meta.roleId
    }),
  [constants.FETCH_ROLE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the roles: ${action.errorMessage}`
    }),
  [constants.FETCH_ROLE_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data._id !== state.get('roleId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data)
    });
  },

  [constants.CLEAR_ROLE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.CREATE_ROLE]: (state) =>
    state.merge({
      ...initialState,
      isNew: true,
      page: 'chooseApplication'
    }),
  [constants.ROLE_APPLICATION_SELECTED]: (state, action) =>
    state.setIn([ 'record', 'applicationId' ], action.payload.applicationId)
      .setIn([ 'page' ], action.payload.applicationId && action.payload.applicationId.length ? 'editRole' : 'chooseApplication'),
  [constants.EDIT_ROLE]: (state, action) =>
    state.merge({
      ...initialState,
      isEdit: true,
      record: action.payload.role,
      roleId: action.payload.role._id,
      page: 'editRole'
    }),
  [constants.SAVE_ROLE_PENDING]: (state) =>
    state.merge({
      loading: true,
      validationErrors: Map()
    }),
  [constants.SAVE_ROLE_REJECTED]: (state, action) => {
    const validationErrors = (action.payload.data && action.payload.data.errors && Map(action.payload.data.errors)) || Map();
    const errorMessage = (action.payload.data && action.payload.data.errors) ? 'Validation Error' : (action.errorMessage || 'Validation Error');

    return state.merge({
      loading: false,
      validationErrors,
      error: `An error occured while saving the role: ${errorMessage}`
    });
  },
  [constants.SAVE_ROLE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.REQUEST_DELETE_ROLE]: (state, action) =>
    state.merge({
      isDelete: true,
      record: action.payload.role,
      roleId: action.payload.role._id,
      requesting: true
    }),
  [constants.CANCEL_DELETE_ROLE]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.DELETE_ROLE_PENDING]: (state) =>
    state.merge({
      loading: true
    }),
  [constants.DELETE_ROLE_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while deleting the role: ${action.errorMessage}`
    }),
  [constants.DELETE_ROLE_FULFILLED]: (state) =>
    state.merge({
      ...initialState
    })
});
