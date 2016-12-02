import axios from 'axios';
import * as constants from '../constants';

/*
 * Load all connections available in the Auth0 account.
 */
export function fetchConnections() {
  return {
    type: constants.FETCH_CONNECTIONS,
    payload: {
      promise: axios.get('/api/connections', {
        responseType: 'json'
      })
    }
  };
}
