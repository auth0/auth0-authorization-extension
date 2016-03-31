import _ from 'lodash';
import { Router } from 'express';
import { managementClient } from '../lib/middlewares';

export default () => {
  const api = Router();
  api.get('/', managementClient, (req, res, next) => {
    req.auth0.connections.getAll({ fields: 'id,name,strategy' })
      .then(connections => _.chain(connections)
        .sortBy((conn) => conn.name.toLowerCase())
        .value())
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
