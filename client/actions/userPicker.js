import axios from 'axios';
import * as constants from '../constants';

export function searchUserPicker(search = '', page = 0) {
  return (dispatch) => {
    dispatch({
      type: constants.OPEN_USER_PICKER,
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
    });
  };
}

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

export function cancelUserPicker() {
  return {
    type: constants.CANCEL_USER_PICKER
  };
}

export function resetUserPicker() {
  return searchUserPicker();
}

export function selectUser(user) {
  return {
    type: constants.SELECT_USER,
    payload: {
      user
    }
  };
}

export function unselectUser(user) {
  return {
    type: constants.UNSELECT_USER,
    payload: {
      user
    }
  };
}
