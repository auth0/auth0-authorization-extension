import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { mfa } from './mfa';
import { block } from './block';
import { unblock } from './unblock';
import { log } from './log';
import { logs } from './logs';
import { user } from './user';
import { users } from './users';
import { role } from './role';
import { roles } from './roles';
import { group } from './group';
import { groups } from './groups';
import { permission } from './permission';
import { permissions } from './permissions';

export default combineReducers({
  routing: routerReducer,
  applications,
  auth,
  mfa,
  block,
  unblock,
  log,
  logs,
  user,
  users,
  role,
  roles,
  group,
  groups,
  permission,
  permissions,
  form: formReducer
});
