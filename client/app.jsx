import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './app.styl';

import * as constants from './constants';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import { loadCredentials } from './actions/auth';
import { fetchRuleStatus } from './actions/configuration';
import routes from './routes';
import configureStore from './store/configureStore';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.API_BASE;

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || ''
});

const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

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
ReactDOM.render(
  <Provider store={store}>
    {routes(reduxHistory)}
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools');
  showDevTools(store);
}
