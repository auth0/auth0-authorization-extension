import axios from 'axios';
import * as constants from '../constants';

/*
 * Load groups.
 */
export function loadGroupPicker() {
  return {
    type: constants.LOAD_GROUP_PICKER,
    payload: {
      promise: axios.get('/api/groups', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}

/*
 * Open the group picker and immediately load the groups.
 */
export function openGroupPicker(title) {
  return (dispatch) => {
    dispatch({
      type: constants.OPEN_GROUP_PICKER,
      payload: {
        title
      }
    });

    dispatch(loadGroupPicker());
  };
}

/*
 * Close the group picker.
 */
export function cancelGroupPicker() {
  return {
    type: constants.CANCEL_GROUP_PICKER
  };
}

/*
 * Reset the group picker.
 */
export function resetGroupPicker() {
  return loadGroupPicker();
}
