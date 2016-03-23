import nconf from 'nconf';
import jwt from 'express-jwt';
import { ManagementClient } from 'auth0';
import { Router } from 'express';

import authorize from './authorize';
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

  const authenticate = jwt({
    secret: new Buffer(nconf.get('AUTH0_CLIENT_SECRET'), 'base64'),
    audience: nconf.get('AUTH0_CLIENT_ID')
  });

  const authenticateOrApiKey = (req, res, next) => {
    const header = req.headers['x-api-key'];
    if (header && header === nconf.get('AUTHORIZE_API_KEY')) {
      req.user = {
        name: 'auth0-rules'
      };
      return next();
    }

    return authenticate(req, res, next);
  };

  const api = Router();
  api.use('/authorize', authenticateOrApiKey, authorize(db, managementClient));
  api.use('/applications', authenticate, applications(db, managementClient));
  api.use('/connections', authenticate, connections(managementClient));
  api.use('/users', authenticate, users(db));
  api.use('/logs', authenticate, logs(db));
  api.use('/roles', authenticate, roles(db));
  api.use('/groups', authenticate, groups(db, managementClient));
  api.use('/permissions', authenticate, permissions(db));
  return api;
};
