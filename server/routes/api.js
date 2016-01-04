import { Router } from 'express';
import auth0 from '../lib/auth0';

import roles from './roles';
import groups from './groups';
import permissions from './permissions';

export default () => {
  const api = Router();
  api.use('/roles', roles());
  api.use('/groups', groups());
  api.use('/permissions', permissions());

  api.get('/logs', (req, res, next) => {
    auth0.getLogs({ sort: 'date:-1', per_page: 20, page: req.query.page || 0, fields: 'type,date,client_name,user_name,description,connection' })
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.get('/logs/:id', (req, res, next) => {
    auth0.getLog(req.params.id)
      .then(log => res.json({ log }))
      .catch(next);
  });

  api.get('/users', (req, res, next) => {
    const options = {
      sort: 'last_login:-1',
      search_engine: 'v2',
      q: req.query.search,
      per_page: 100,
      page: req.query.page || 0,
      include_totals: true,
      fields: 'user_id,name,email,identities,picture,last_login,logins_count,multifactor,blocked'
    };

    auth0.getUsers(options)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.get('/users/:id', (req, res, next) => {
    auth0.getUser(req.params.id)
      .then(user => res.json({ user }))
      .catch(next);
  });

  api.get('/users/:id/devices', (req, res, next) => {
    auth0.getDevices(req.params.id)
      .then(devices => res.json({ devices }))
      .catch(next);
  });

  api.get('/applications', (req, res, next) => {
    auth0.getClients()
      .then(apps => res.json({ applications: apps }))
      .catch(next);
  });

  api.get('/users/:id/logs', (req, res, next) => {
    auth0.getUserLogs(req.params.id)
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.delete('/users/:id/multifactor/:provider', (req, res, next) => {
    auth0.deleteUserMultiFactor(req.params.id, req.params.provider)
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  api.post('/users/:id/block', (req, res, next) => {
    auth0.patchUser(req.params.id, { blocked: true })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  api.post('/users/:id/unblock', (req, res, next) => {
    auth0.patchUser(req.params.id, { blocked: false })
      .then(() => res.sendStatus(200))
      .catch(next);
  });

  // Generic error handler.
  api.use((err, req, res, next) => {
    if (err && err.notFoundError) {
      res.status(404);
      return res.json({ error: err.notFoundError });
    }

    if (err && err.validationError) {
      res.status(400);
      return res.json({ error: err.validationError });
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
