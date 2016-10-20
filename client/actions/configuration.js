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

/*
 * Save Token Contents.
 */
export function saveConfigurationTokenContents(config) {
  return {
    type: constants.SAVE_CONFIGURATION_TOKENCONTENTS,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/configuration/tokencontents',
        data: config,
        responseType: 'json'
      })
    }
  };
}

/*
 * Save Persistence.
 */
export function saveConfigurationPersistence(config) {
  return {
    type: constants.SAVE_CONFIGURATION_PERSISTENCE,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/configuration/persistence',
        data: config,
        responseType: 'json'
      })
    }
  };
}

/*
 * Save API Access.
 */
export function saveConfigurationAPIAccess(config) {
  return {
    type: constants.SAVE_CONFIGURATION_APIACCESS,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/configuration/apiaccess',
        data: config,
        responseType: 'json'
      })
    }
  };
}
