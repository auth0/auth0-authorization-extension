import axios from 'axios';
import * as constants from '../constants';


export function importConfig(text) {
  return {
    type: constants.FETCH_CONFIGURATION_IMPORT,
    payload: {
      promise: axios.post('/api/configuration/import', text, {
        responseType: 'json'
      })
    },
    meta: {
      config: text
    }
  };
}

export function exportConfig() {
  return {
    type: constants.FETCH_CONFIGURATION_EXPORT,
    payload: {
      promise: axios.get('/api/configuration/export', {
        responseType: 'json'
      })
    }
  };
}