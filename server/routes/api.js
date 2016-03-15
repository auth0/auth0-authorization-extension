import nconf from 'nconf';
import { Router } from 'express';

import logger from '../lib/logger';
import applications from './applications';
import logs from './logs';
import users from './users';
import roles from './roles';
import groups from './groups';
import permissions from './permissions';

import Database from '../lib/storage/database';
import S3Provider from '../lib/storage/providers/s3';

export default () => {
  
  const db = new Database({
    provider: new S3Provider({
      path: 'iam-dashboard.json',
      bucket: nconf.get('AWS_S3_BUCKET'),
      keyId: nconf.get('AWS_ACCESS_KEY_ID'),
      keySecret: nconf.get('AWS_SECRET_ACCESS_KEY')
    })
  });
  
  const api = Router();
  api.use('/applications', applications(db));
  api.use('/users', users(db));
  api.use('/logs', logs(db));
  api.use('/roles', roles(db));
  api.use('/groups', groups(db));
  api.use('/permissions', permissions(db));
  return api;
};
