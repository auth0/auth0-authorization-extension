import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { connections } from './connections';
import { configuration } from './configuration';
import { user } from './user';
import { userPicker } from './userPicker';
import { users } from './users';
import { role } from './role';
import { roles } from './roles';
import { permission } from './permission';
import { permissions } from './permissions';
import { group } from './group';
import { groupPicker } from './groupPicker';
import { groupMember } from './groupMember';
import { groupNested } from './groupNested';
import { groupMapping } from './groupMapping';
import { groups } from './groups';
import { ruleStatus } from './ruleStatus';
import { importExport } from './importExport';
import { groupRoles } from './groupRoles';
import { userRoles } from './userRoles';

function lastAction(state = null, action) {
  return action;
}

export default combineReducers({
  routing: routerReducer,
  applications,
  connections,
  configuration,
  auth,
  user,
  users,
  userPicker,
  role,
  roles,
  permission,
  permissions,
  group,
  groupPicker,
  groupMember,
  groupMapping,
  groupNested,
  groups,
  ruleStatus,
  importExport,
  groupRoles,
  userRoles,
  lastAction,
  form: formReducer
});
