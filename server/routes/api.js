import { Router } from 'express';

import { getDb } from '../lib/storage/getdb';
import * as middlewares from '../lib/middlewares';

import authorize from './authorize';
import applications from './applications';
import users from './users';
import groups from './groups';

export default () => {
  const db = getDb();
  const api = Router();
  api.use(middlewares.readSubject);
  api.use('/authorize', middlewares.authenticateOrApiKey, authorize(db));
  api.use('/users', middlewares.authenticate, users(db));
  api.use('/groups', middlewares.authenticate, groups(db));


  /*
  Consider bulk imports in the future:
  api.get('/bulk/export', middlewares.authenticate, (req, res) => {
    db.provider._readObject('groups')
      .then(data => res.json(data));
  });

  api.post('/bulk/import', middlewares.authenticate, (req, res, next) => {
    db.provider._writeObject(req.body)
    .then(() => res.sendStatus(202))
    .catch(next);
  });
  */
  return api;
};
