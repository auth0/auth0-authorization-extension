import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import * as containers from './containers';

export default (history) =>
  <Router history={history}>
    <Route path="/" component={containers.RequireAuthentication(containers.App)}>
      <IndexRedirect to="/users" />
      <Route path="configuration">
        <Route path="rule" component={containers.ConfigurationRule} />
      </Route>
      <Route path="roles" component={containers.Roles}>
        <Route path=":id" component={containers.Role} />
      </Route>
      <Route path="groups" component={containers.Groups}>
        <Route path=":id" component={containers.Group} />
      </Route>
      <Route path="permissions" component={containers.Permissions}>
        <Route path=":id" component={containers.Permission} />
      </Route>
      <Route path="users" component={containers.Users}>
        <Route path=":id" component={containers.User} />
      </Route>
    </Route>
    <Route path="/login" component={containers.Login} />
  </Router>;
