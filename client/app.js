import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as constants from './constants';
import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'
import { routerMiddleware, syncHistoryWithStore } from 'react-router-redux';

import { loadCredentials } from './actions/auth';
import { fetchRuleStatus } from './actions/configuration';
import routes from './routes';
import configureStore from './store/configureStore';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

// Make history aware of the base path.
const history = useRouterHistory(createHistory)({
  basename: window.config.BASE_PATH || ''
});

const store = configureStore([ routerMiddleware(history) ], { });
const reduxHistory = syncHistoryWithStore(history, store);

// Fire first events.
store.subscribe(() => {
  if (store.getState().lastAction.type === constants.LOGIN_SUCCESS) {
    store.dispatch(fetchRuleStatus());
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
