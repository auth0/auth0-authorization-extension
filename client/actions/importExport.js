import axios from 'axios';
import * as constants from '../constants';

export function importConfigPrepare(file) {
  return (dispatch) => {
    const name = file.name;
    const regex = new RegExp('(.*?)\.(json)$');
    if (regex.test(name)) {
      let reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt) => {
        const result = JSON.parse(evt.target.result);
        return dispatch(openPreview(result));
      };
      reader.onerror = (evt) => {
        dispatch(addError('Something went wrong.'));
      };
    } else {
      dispatch(addError('Incorrect file type.'));
    }
  }
}

export function openPreview(text) {
  return {
    type: constants.OPEN_CONFIGURATION_PREVIEW,
    meta: {
      preview: text
    }
  }
}

export function closePreview() {
  return {
    type: constants.CLOSE_CONFIGURATION_PREVIEW
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
      error
    }
  }
}

export function closeError() {
  return {
    type: constants.FETCH_CONFIGURATION_CLOSE_ERROR
  }
}
