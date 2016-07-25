import axios from 'axios';
import { push } from 'react-router-redux';

import * as constants from '../constants';

/*
 * Open the configuration tab.
 */
export function goToConfiguration() {
  return (dispatch) => {
    dispatch(push('/configuration/rule'));
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
 * Load configuration data.
 */
export function fetchConfiguration() {
  return {
    type: constants.FETCH_CONFIGURATION,
    payload: {
      promise: axios.get('/api/configuration', {
        responseType: 'json'
      })
    }
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
        responseType: 'json'
      })
    }
  };
}

/*
 * Save the configuration.
 */
export function saveConfiguration(config) {
  return {
    type: constants.SAVE_CONFIGURATION,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/configuration',
        data: config,
        responseType: 'json'
      })
    }
  };
}
