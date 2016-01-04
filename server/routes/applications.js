import { Router } from 'express';
import auth0 from '../lib/auth0';

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    auth0.getClients()
      .then(apps => res.json({ applications: apps }))
      .catch(next);
  });

  return api;
};
