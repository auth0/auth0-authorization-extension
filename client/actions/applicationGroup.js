import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the groups of a single application.
 */
export function fetchApplicationGroups(applicationId, reload) {
  return {
    type: constants.FETCH_APPLICATION_GROUPS,
    meta: {
      applicationId,
      reload
    },
    payload: {
      promise: axios.get(`/api/applications/${applicationId}/groups`, {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

/*
 * Add the selected groups to a application.
 */
export function addApplicationGroup(applicationId, groupId, callback) {
  return (dispatch) => {
    dispatch({
      type: constants.ADD_APPLICATION_GROUP,
      payload: {
        promise: axios({
          method: 'post',
          url: `/api/applications/${applicationId}/groups`,
          data: {
            groupId
          },
          timeout: 5000,
          responseType: 'json'
        })
      },
      meta: {
        applicationId,
        onSuccess: callback
      }
    });
  };
}

/*
 * Request if it's ok to remove a group.
 */
export function requestRemoveApplicationGroup(application, group) {
  return {
    type: constants.REQUEST_REMOVE_APPLICATION_GROUP,
    meta: {
      application,
      group
    }
  };
}

/*
 * Cancel the remove process.
 */
export function cancelRemoveApplicationGroup() {
  return {
    type: constants.CANCEL_REMOVE_APPLICATION_GROUP
  };
}

/*
 * Remove a group from the application.
 */
export function removeApplicationGroup(applicationId, groupId) {
  return {
    type: constants.REMOVE_APPLICATION_GROUP,
    payload: {
      promise: axios({
        method: 'delete',
        url: `/api/applications/${applicationId}/groups`,
        data: {
          groupId
        },
        timeout: 5000,
        responseType: 'json'
      })
    },
    meta: {
      groupId,
      applicationId
    }
  };
}
