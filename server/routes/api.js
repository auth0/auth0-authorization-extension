import nconf from 'nconf';
import { ManagementClient } from 'auth0';
import { Router } from 'express';

import applications from './applications';
import connections from './connections';
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

  const managementClient = new ManagementClient({
    token: nconf.get('AUTH0_APIV2_TOKEN'),
    domain: nconf.get('AUTH0_DOMAIN')
  });

  const api = Router();
  api.use('/applications', applications(managementClient));
  api.use('/connections', connections(managementClient));
  api.use('/users', users(db));
  api.use('/logs', logs(db));
  api.use('/roles', roles(db));
  api.use('/groups', groups(db, managementClient));
  api.use('/permissions', permissions(db));
  return api;
};
