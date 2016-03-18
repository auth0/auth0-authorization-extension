import axios from 'axios';
import * as constants from '../constants';

/*
 * Search for users.
 */
export function searchUserPicker(search = '', page = 0) {
  return {
    type: constants.SEARCH_USER_PICKER,
    payload: {
      promise: axios.get('/api/users', {
        params: {
          search,
          page,
          per_page: 10
        },
        timeout: 5000,
        responseType: 'json'
      })
    },
    meta: {
      page
    }
  };
}

/*
 * Open the user picker and immediately search for users.
 */
export function openUserPicker(title) {
  return (dispatch) => {
    dispatch({
      type: constants.OPEN_USER_PICKER,
      payload: {
        title
      }
    });

    dispatch(searchUserPicker());
  };
}

/*
 * Close the user picker.
 */
export function cancelUserPicker() {
  return {
    type: constants.CANCEL_USER_PICKER
  };
}

/*
 * Reset the user picker.
 */
export function resetUserPicker() {
  return searchUserPicker();
}

/*
 * Select a single user.
 */
export function selectUser(user) {
  return {
    type: constants.SELECT_USER,
    payload: {
      user
    }
  };
}

/*
 * Unselect a user.
 */
export function unselectUser(user) {
  return {
    type: constants.UNSELECT_USER,
    payload: {
      user
    }
  };
}
