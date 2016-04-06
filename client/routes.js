import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import * as containers from './containers';
import { RequireAuthentication } from './containers/RequireAuthentication';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={RequireAuthentication(containers.App)}>
      <IndexRedirect to="/users" />
      <Route path="applications" component={containers.ApplicationsContainer}>
        <Route path=":id" component={containers.ApplicationContainer} />
      </Route>
      <Route path="roles" component={containers.RolesContainer}>
        <Route path=":id" component={containers.RoleContainer} />
      </Route>
      <Route path="groups" component={containers.GroupsContainer}>
        <Route path=":id" component={containers.GroupContainer} />
      </Route>
      <Route path="permissions" component={containers.PermissionsContainer}>
        <Route path=":id" component={containers.PermissionContainer} />
      </Route>
      <Route path="logs" component={containers.LogsContainer} />
      <Route path="users" component={containers.UsersContainer}>
        <Route path=":id" component={containers.UserContainer} />
      </Route>
    </Route>
    <Route path="/login" component={containers.LoginContainer} />
  </Router>;
