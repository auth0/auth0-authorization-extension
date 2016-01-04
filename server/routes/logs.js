import { Router } from 'express';
import auth0 from '../lib/auth0';

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    auth0.getLogs({ sort: 'date:-1', per_page: 20, page: req.query.page || 0, fields: 'type,date,client_name,user_name,description,connection' })
      .then(logs => res.json(logs))
      .catch(next);
  });

  api.get('/:id', (req, res, next) => {
    auth0.getLog(req.params.id)
      .then(log => res.json({ log }))
      .catch(next);
  });

  return api;
};
