import axios from 'axios';
import * as constants from '../constants';

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
