import axios from 'axios';

import * as constants from '../constants';

/*
 * Load all applications in an Auth0 account.
 */
export function fetchApplications() {
  return {
    type: constants.FETCH_APPLICATIONS,
    payload: {
      promise: axios.get('/api/applications', {
        responseType: 'json'
      })
    }
  };
}
