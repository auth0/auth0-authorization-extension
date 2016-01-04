import * as constants from '../constants';
import axios from 'axios';

export function fetchApplications(reload = false) {
  return (dispatch, getState) => {
    if (reload || !getState().applications.get('records').size) {
      dispatch({
        type: constants.FETCH_APPLICATIONS,
        payload: {
          promise: axios.get('/api/applications', {
            timeout: 5000,
            responseType: 'json'
          })
        }
      });
    }
  };
}
