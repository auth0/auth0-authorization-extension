import { Router } from 'express';

import logger from '../lib/logger';
import applications from './applications';
import logs from './logs';
import users from './users';
import roles from './roles';
import groups from './groups';
import permissions from './permissions';

export default () => {
  const api = Router();
  api.use('/applications', applications());
  api.use('/users', users());
  api.use('/logs', logs());
  api.use('/roles', roles());
  api.use('/groups', groups());
  api.use('/permissions', permissions());

  // Generic error handler.
  api.use((err, req, res, next) => {
    logger.error(err);
    
    if (err && err.name === 'NotFoundError') {
      res.status(404);
      return res.json({ error: err.message });
    }

    if (err && err.name === 'ValidationError') {
      res.status(400);
      return res.json({ error: err.message });
    }

    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {
        message: err.message,
        status: err.status,
        stack: err.stack
      }
    });
  });

  return api;
};
