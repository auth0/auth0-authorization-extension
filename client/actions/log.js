import axios from 'axios';
import * as constants from '../constants';

/*
 * Load logs.
 */
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
        responseType: 'json'
      })
    }
  };
}

/*
 * Get the details for a single log.
 */
export function fetchLog(logId) {
  return {
    type: constants.FETCH_LOG,
    meta: {
      logId
    },
    payload: {
      promise: axios.get(`/api/logs/${logId}`, {
        responseType: 'json'
      })
    }
  };
}

/*
 * Remove the current log.
 */
export function clearLog() {
  return {
    type: constants.CLEAR_LOG
  };
}
