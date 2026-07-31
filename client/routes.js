import React from 'react';  // eslint-disable-line no-unused-vars
import { Route, Navigate } from 'react-router-dom';  // eslint-disable-line no-unused-vars

import { containers } from './containers';
import withRouter from './utils/withRouter';

const RequireApp = containers.RequireAuthentication(containers.App);
const Group = withRouter(containers.Group);
const User = withRouter(containers.User);
const Login = withRouter(containers.Login);

// Returns the <Route> tree consumed by createRoutesFromElements in router.js.
export default () =>
  <React.Fragment>
    <Route path="/" element={<RequireApp />}>
      <Route index element={<Navigate to="/users" replace />} />
      <Route path="configuration">
        <Route path="rule" element={<containers.ConfigurationRule />} />
        <Route path="import-export" element={<containers.ConfigurationRule />} />
        <Route path="api" element={<containers.API />} />
      </Route>
      <Route path="groups" element={<containers.Groups />} />
      <Route path="groups/:id" element={<Group />} />
      <Route path="roles" element={<containers.Roles />} />
      <Route path="permissions" element={<containers.Permissions />} />
      <Route path="users" element={<containers.Users />} />
      <Route path="users/:id" element={<User />} />
    </Route>
    <Route path="/login" element={<Login />} />
  </React.Fragment>;
