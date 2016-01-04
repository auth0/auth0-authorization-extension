import moment from 'moment';
import { fromJS, Map } from 'immutable';

import * as constants from '../constants';
import logTypes from '../utils/logTypes';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  userId: null,
  record: Map(),
  logs: {
    loading: false,
    error: null,
    records: []
  },
  devices: {
    loading: false,
    error: null,
    records: Map()
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
    if (data.user.user_id !== state.get('userId')) {
      return state;
    }

    return state.merge({
      loading: false,
      record: fromJS(data.user)
    });
  },

  [constants.FETCH_USER_LOGS_PENDING]: (state, action) =>
    state.merge({
      logs: userLogs(state.get('logs'), action)
    }),
  [constants.FETCH_USER_LOGS_REJECTED]: (state, action) =>
    state.merge({
      logs: userLogs(state.get('logs'), action)
    }),
  [constants.FETCH_USER_LOGS_FULFILLED]: (state, action) =>
    state.merge({
      logs: userLogs(state.get('logs'), action)
    }),

  [constants.FETCH_USER_DEVICES_PENDING]: (state, action) =>
    state.merge({
      devices: userDevices(state.get('devices'), action)
    }),
  [constants.FETCH_USER_DEVICES_REJECTED]: (state, action) =>
    state.merge({
      devices: userDevices(state.get('devices'), action)
    }),
  [constants.FETCH_USER_DEVICES_FULFILLED]: (state, action) =>
    state.merge({
      devices: userDevices(state.get('devices'), action)
    })
});

const userLogs = createReducer(fromJS(initialState.logs), {
  [constants.FETCH_USER_LOGS_PENDING]: (state) =>
    state.merge({
      ...initialState.logs,
      loading: true
    }),
  [constants.FETCH_USER_LOGS_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.logs,
      error: `An error occured while loading the user logs: ${action.errorMessage}`
    }),
  [constants.FETCH_USER_LOGS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      records: fromJS(action.payload.data.logs.map(log => {
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
      }))
    })
});

const userDevices = createReducer(fromJS(initialState.devices), {
  [constants.FETCH_USER_DEVICES_PENDING]: (state) =>
    state.merge({
      ...initialState.devices,
      loading: true
    }),
  [constants.FETCH_USER_DEVICES_REJECTED]: (state, action) =>
    state.merge({
      ...initialState.devices,
      error: `An error occured while loading the devices: ${action.errorMessage}`
    }),
  [constants.FETCH_USER_DEVICES_FULFILLED]: (state, action) => {
    const devices = action.payload.data.devices.reduce((map, device) => {
      map[device.device_name] = (map[device.device_name] || 0) + 1;
      return map;
    }, { });

    return state.merge({
      loading: false,
      records: fromJS(devices)
    });
  }
});
