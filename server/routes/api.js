import nconf from 'nconf';
import jwt from 'express-jwt';
import { Router } from 'express';
import jwtDecode from 'jwt-decode';
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
import _ from 'lodash';
import authorizeRule from '../rules/authorize';

const readSub = (req, res, next) => {
  const token        = req.get('Authorization').replace('Bearer ', '').replace('Bearer ', '');
  const decodedToken = jwtDecode(token);
  req.sub = decodedToken.sub;
  next();
}

const ensureRule = (req, res, next) => {
  const ruleVersion = '1.0';
  const db = getDb();
  const createRule = (ruleVersion, db, req, next) => {
    return req.auth0.rules.create({
      name: 'iam-dashboard',
      enabled: true,
      script: authorizeRule(req.webtaskContext.secrets.WT_URL, req.webtaskContext.secrets.EXTENSION_SECRET)
    })
    .then(() => {
      return db.createRule({version: ruleVersion});
    })
    .then(() => {
      next();
    })
    .catch((err) => {
      next();
    });
  }

  db.getRules()
    // Rule already installed
    .then((data) => {
      let found = _.find(data, {version: ruleVersion});

      if (found) {
        return next();
      }

      return createRule(ruleVersion, db, req, next);
    })
    .catch(() => {
      createRule(ruleVersion, db, req, next);
    });
}

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
  api.use(readSub, managementClient, ensureRule);

  api.use('/authorize'   , authenticateOrApiKey, readSub, authorize(db, managementClient));
  api.use('/applications', authenticate        , readSub, applications(db));
  api.use('/connections' , authenticate        , readSub, connections());
  api.use('/users'       , authenticate        , readSub, users(db));
  api.use('/logs'        , authenticate        , readSub, logs(db));
  // api.use('/roles', authenticate, roles(db));
  // api.use('/permissions', authenticate, permissions(db));
  api.use('/groups'      , authenticate        , readSub, groups(db));
  return api;
};
