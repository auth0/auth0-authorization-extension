import nconf from 'nconf';
import jwt from 'express-jwt';
import { Router } from 'express';

import { getDb } from '../lib/storage/getdb';
import authorize from './authorize';
import applications from './applications';
import connections from './connections';
import logs from './logs';
import users from './users';
// import roles from './roles';
import groups from './groups';
// import permissions from './permissions';
import { managementClient } from '../lib/middlewares';

export default () => {
  const db = getDb();

  let authenticate = jwt({
    secret: (req, payload, done) => {
      done(null, req.webtaskContext.data.EXTENSION_SECRET);
    }
  });

  if (!nconf.get('USE_OAUTH2')) {
    authenticate = jwt({
      secret: new Buffer(nconf.get('AUTH0_CLIENT_SECRET'), 'base64'),
      audience: nconf.get('AUTH0_CLIENT_ID')
    });
  }

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
  api.use('/applications', authenticate, applications(db));
  api.use('/connections', authenticate, connections());
  api.use('/users', authenticate, users(db));
  api.use('/logs', authenticate, logs(db));
  // api.use('/roles', authenticate, roles(db));
  // api.use('/permissions', authenticate, permissions(db));
  api.use('/groups', authenticate, groups(db));
  return api;
};
