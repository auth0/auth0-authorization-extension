import axios from 'axios';
import * as constants from '../constants';

export function importConfigPrepare(file) {
  return (dispatch) => {
    let name = file.name;
    let regex = new RegExp("(.*?)\.(json)$");
    if (regex.test(name)) {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        let result = JSON.parse(evt.target.result);
        return dispatch(importConfig(result));
      }
      reader.onerror = (evt) => {
        dispatch(addError('Something went wrong.'));
      }
    } else {
      dispatch(addError('Incorrect file type.'));
    }
  }
}

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

export function addError(error) {
  return {
    type: constants.FETCH_CONFIGURATION_ADD_ERROR,
    meta: {
      error: error
    }
  }
}

export function closeError() {
  return {
    type: constants.FETCH_CONFIGURATION_CLOSE_ERROR
  }
}