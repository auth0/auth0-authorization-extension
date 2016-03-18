import _ from 'lodash';
import { Router } from 'express';

export default (auth0) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    auth0.clients.getAll({ fields: 'client_id,name,callbacks,global' })
      .then(clients => _.chain(clients)
        .filter([ 'global', false ])
        .sortBy((client) => client.name.toLowerCase())
        .value())
      .then(clients => res.json(clients))
      .catch(next);
  });

  api.get('/:id', (req, res, next) => {
    auth0.clients.get({ client_id: req.params.id })
      .then(client => res.json(client))
      .catch(next);
  });

  return api;
};
