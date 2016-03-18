import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import { RequireAuthentication } from './containers/RequireAuthentication';

import App from './containers/App.jsx';
import ApplicationsContainer from './containers/Applications/ApplicationsContainer';
import LogsContainer from './containers/Logs/LogsContainer';
import LoginContainer from './containers/Login/LoginContainer';
import GroupContainer from './containers/Groups/GroupContainer';
import GroupsContainer from './containers/Groups/GroupsContainer';
import PermissionsContainer from './containers/Permissions/PermissionsContainer';
import RolesContainer from './containers/Roles/RolesContainer';
import UserContainer from './containers/User/UserContainer';
import UsersContainer from './containers/Users/UsersContainer';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(App)}>
      <IndexRedirect to="/users" />
      <Route path="applications" component={ApplicationsContainer} />
      <Route path="roles" component={RolesContainer} />
      <Route path="groups" component={GroupsContainer}>
        <Route path=":id" component={GroupContainer} />
      </Route>
      <Route path="permissions" component={PermissionsContainer} />
      <Route path="logs" component={LogsContainer} />
      <Route path="users" component={UsersContainer}>
        <Route path=":id" component={UserContainer} />
      </Route>
    </Route>
    <Route path="/login" component={LoginContainer} />
  </Router>;
