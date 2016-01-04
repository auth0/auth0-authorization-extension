import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect } from 'react-router';
import { syncReduxAndRouter } from 'redux-simple-router';
import createHistory from 'history/lib/createBrowserHistory';

import { loadCredentials } from './actions/auth';

import App from './containers/App.jsx';
import { RequireAuthentication } from './containers/RequireAuthentication';

import LoginContainer from './containers/Login/LoginContainer';
import LogsContainer from './containers/Logs/LogsContainer';
import UserContainer from './containers/User/UserContainer';
import UsersContainer from './containers/Users/UsersContainer';
import RolesContainer from './containers/Roles/RolesContainer';
import GroupsContainer from './containers/Groups/GroupsContainer';
import PermissionsContainer from './containers/Permissions/PermissionsContainer';
import ApplicationsContainer from './containers/Applications/ApplicationsContainer';

import configureStore from './store/configureStore';
const history = createHistory();
const store = configureStore({ });
syncReduxAndRouter(history, store);

// Fire first events.
store.dispatch(loadCredentials());

// Render application.
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={RequireAuthentication(App)}>
        <IndexRedirect to="/users" />
        <Route path="applications" component={ApplicationsContainer} />
        <Route path="roles" component={RolesContainer} />
        <Route path="groups" component={GroupsContainer} />
        <Route path="permissions" component={PermissionsContainer} />
        <Route path="logs" component={LogsContainer} />
        <Route path="users" component={UsersContainer}>
          <Route path=":id" component={UserContainer} />
        </Route>
      </Route>
      <Route path="/login" component={LoginContainer} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
