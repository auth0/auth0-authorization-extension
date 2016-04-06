import { Router } from 'express';

import { getDb } from '../lib/storage/getdb';
import * as middlewares from '../lib/middlewares';

import authorize from './authorize';
import applications from './applications';
import connections from './connections';
import logs from './logs';
import users from './users';
import roles from './roles';
import groups from './groups';
import permissions from './permissions';

export default () => {
  const db = getDb();
  const api = Router();
  api.use(middlewares.readSubject);
  api.use('/authorize', middlewares.authenticateOrApiKey, authorize(db));
  api.use('/applications', middlewares.authenticate, applications(db));
  api.use('/connections', middlewares.authenticate, connections());
  api.use('/users', middlewares.authenticate, users(db));
  api.use('/roles', middlewares.authenticate, roles(db));
  api.use('/permissions', middlewares.authenticate, permissions(db));
  api.use('/groups', middlewares.authenticate, groups(db));
  api.use('/logs', middlewares.authenticate, logs(db));
  return api;
};
