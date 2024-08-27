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

// No longer used
// /*
//  * Load the details of a single application.
//  */
// export function fetchApplicationDetails(applicationId) {
//   return {
//     type: constants.FETCH_APPLICATION,
//     meta: {
//       applicationId
//     },
//     payload: {
//       promise: axios.get(`/api/applications/${applicationId}`, {
//         responseType: 'json'
//       })
//     }
//   };
// }

/*
 * Load a single application.
 */
export function fetchApplication(applicationId) {
  return (dispatch) => {
    dispatch(fetchApplicationDetails(applicationId));
  };
}
