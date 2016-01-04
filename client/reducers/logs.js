import moment from 'moment';
import { fromJS } from 'immutable';
import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  loading : false,
  error: null,
  records: [],
  currentRecord: null
};

export const logs = createReducer(fromJS(initialState), {
  [constants.FETCH_LOGS_PENDING]: (state, action) =>
    state.merge({
      loading: true,
      records: action.meta.page === 0 ? [] : state.get('records')
    }),
  [constants.FETCH_LOGS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the logs: ${action.errorMessage}`
    }),
  [constants.FETCH_LOGS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      total: data.total,
      nextPage: action.meta.page + 1,
      records: state.get('records').concat(fromJS(data.logs.map(log => {
        log.time_ago = moment(log.date).fromNow();
        log.type = logTypes[log.type];
        if (!log.type) {
          log.type = {
            event: 'Unknown Error',
            icon: {
              name: '354',
              color: '#FFA500'
            }
          };
        }
        return log;
      })))
    });
  }
});
