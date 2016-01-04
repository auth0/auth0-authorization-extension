import * as constants from '../constants';
import axios from 'axios';

export function fetchLogs(page = 0) {
  return {
    type: constants.FETCH_LOGS,
    meta: {
      page
    },
    payload: {
      promise: axios.get('/api/logs', {
        params: {
          page
        },
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

export function fetchLog(logId) {
  return (dispatch) => {
    dispatch({
      type: constants.FETCH_LOG,
      meta: {
        logId
      },
      payload: {
        promise: axios.get(`/api/logs/${logId}`, {
          timeout: 5000,
          responseType: 'json'
        })
      }
    });
  };
}

export function clearLog() {
  return {
    type: constants.CLEAR_LOG
  };
}
