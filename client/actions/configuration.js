import axios from 'axios';
import { push } from 'react-router-redux';

import * as constants from '../constants';

/*
 * Open the configuration tab.
 */
export function goToConfiguration() {
  return (dispatch) => {
    dispatch(push('/configuration'));
  };
}

/*
 * Open the rules page.
 */
export function goToRules() {
  return () => {
    window.location.assign('https://manage.auth0.com/#/rules');
  };
}

/*
 * Fetch the status of the rule.
 */
export function fetchRuleStatus() {
  return {
    type: constants.FETCH_RULE_STATUS,
    payload: {
      promise: axios.get('/api/configuration/status', {
        timeout: 5000,
        responseType: 'json'
      })
    }
  };
}
