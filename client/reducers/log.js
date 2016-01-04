import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  logId: null,
  record: Map()
};

export const log = createReducer(fromJS(initialState), {
  [constants.CLEAR_LOG]: (state) =>
    state.merge({
      ...initialState
    }),
  [constants.FETCH_LOG_PENDING]: (state, action) =>
    state.merge({
      ...initialState,
      loading: true,
      logId: action.meta.logId
    }),
  [constants.FETCH_LOG_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the log record: ${action.errorMessage}`
    }),
  [constants.FETCH_LOG_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    if (data.log._id !== state.get('logId')) {
      return state;
    }

    let logType = logTypes[data.log.type];
    if (!logType) {
      logType = {
        event: 'Unknown Error',
        icon: {
          name: '354',
          color: '#FFA500'
        }
      };
    }

    data.log.type = logType.event;

    return state.merge({
      loading: false,
      record: fromJS(data.log)
    });
  }
});
