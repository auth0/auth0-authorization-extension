import axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './app.styl';

import * as constants from './constants';
import { router } from './router';

import { loadCredentials } from './actions/auth';
import { fetchRuleStatus } from './actions/configuration';
import configureStore from './store/configureStore';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.API_BASE;

const store = configureStore([], { });

// Check if the rule is enabled.
store.subscribe(() => {
  switch (store.getState().lastAction.type) {
    case constants.LOGIN_SUCCESS:
    case constants.SAVE_CONFIGURATION_REJECTED:
    case constants.SAVE_CONFIGURATION_FULFILLED:
      store.dispatch(fetchRuleStatus());
      break;
    default:
      break;
  }
});
store.dispatch(loadCredentials());

// Render application.
const root = createRoot(document.getElementById('app'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
