import _ from 'lodash';
import { Router } from 'express';

export default (auth0) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    auth0.connections.getAll({ fields: 'id,name,strategy' })
      .then(connections => _.chain(connections)
        .sortBy((conn) => conn.name.toLowerCase())
        .value())
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
