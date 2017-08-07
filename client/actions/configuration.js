import _ from 'lodash';
import axios from 'axios';
import { push } from 'react-router-redux';

import * as constants from '../constants';

/*
 * Open the configuration tab.
 */
export function goToConfiguration() {
  return (dispatch) => {
    dispatch(setActiveTab(1));
    dispatch(push('/configuration/rule'));
  };
}

/*
 * Open the API tab.
 */
export function goToAPI() {
  return (dispatch) => {
    dispatch(push('/configuration/api'));
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
 * Go to import/export in Configuration.
 */
export function goToImportExport() {
  return (dispatch) => {
    dispatch(setActiveTab(3));
    dispatch(push('/configuration/import-export'));
  };
}

/*
 * Set active tab
 */
export function setActiveTab(activeTab) {
  return {
    type: constants.SET_CONFIGURATION_TAB,
    meta: {
      activeTab
    }
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
 * Save Configuration.
 */
export function saveConfiguration(config) {
  const configData = _.pick(config, [
    'groupsInIdToken', 'rolesInIdToken', 'permissionsInIdToken', 'idTokenNamespace',
    'groupsInAccessToken', 'rolesInAccessToken', 'permissionsInAccessToken', 'accessTokenNamespace',
    'persistGroups', 'persistRoles', 'persistPermissions',
    'groupsPassthrough', 'rolesPassthrough', 'permissionsPassthrough',
    'persistOnClientLevel', 'disableCaching'
  ]);
  return {
    type: constants.SAVE_CONFIGURATION,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/configuration',
        data: configData,
        responseType: 'json'
      })
    }
  };
}

/*
 * Load configuration data.
 */
export function fetchConfigurationResourceServer() {
  return {
    type: constants.FETCH_CONFIGURATION_RESOURCESERVER,
    payload: {
      promise: axios.get('/api/configuration/resource-server', {
        responseType: 'json'
      })
    }
  };
}

/*
 * Save Configuration Resource Server.
 */
export function saveConfigurationResourceServer(config) {
  const configData = _.pick(config, [
    'apiAccess', 'token_lifetime'
  ]);

  return (dispatch) => ({
    type: constants.SAVE_CONFIGURATION_RESOURCESERVER,
    payload: {
      promise: axios({
        method: 'patch',
        url: '/api/configuration/resource-server',
        data: configData,
        responseType: 'json',
        onSuccess: () => {
          dispatch(fetchConfigurationResourceServer());
        }
      })
    }
  });
}

/*
 * Remove Configuration Resource Server.
 */
export function removeConfigurationResourceServer() {
  return {
    type: constants.REMOVE_CONFIGURATION_RESOURCESERVER,
    payload: {
      promise: axios({
        method: 'delete',
        url: '/api/configuration/resource-server',
        responseType: 'json'
      })
    }
  };
}

/*
 * Load explorer configuration.
 */
export function fetchConfigurationExplorer() {
  return {
    type: constants.FETCH_CONFIGURATION_EXPLORER,
    payload: {
      promise: axios.get('/swagger.json', {
        responseType: 'json'
      })
    }
  };
}
