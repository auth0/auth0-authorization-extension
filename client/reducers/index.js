import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { application } from './application';
import { applicationGroup } from './applicationGroup';
import { applications } from './applications';
import { connections } from './connections';
import { configuration } from './configuration';
import { mfa } from './mfa';
import { block } from './block';
import { unblock } from './unblock';
import { log } from './log';
import { logs } from './logs';
import { user } from './user';
import { userPicker } from './userPicker';
import { users } from './users';
import { role } from './role';
import { roles } from './roles';
import { group } from './group';
import { groupPicker } from './groupPicker';
import { groupMember } from './groupMember';
import { groupNested } from './groupNested';
import { groupMapping } from './groupMapping';
import { groups } from './groups';
import { permission } from './permission';
import { permissions } from './permissions';
import { ruleStatus } from './ruleStatus';

function lastAction(state = null, action) {
  return action;
}


export default combineReducers({
  routing: routerReducer,
  application,
  applicationGroup,
  applications,
  connections,
  configuration,
  auth,
  mfa,
  block,
  unblock,
  log,
  logs,
  user,
  users,
  userPicker,
  role,
  roles,
  group,
  groupPicker,
  groupMember,
  groupMapping,
  groupNested,
  groups,
  permission,
  permissions,
  ruleStatus,
  lastAction,
  form: formReducer
});
