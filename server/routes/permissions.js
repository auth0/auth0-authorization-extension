import { Router } from 'express';
import validator from 'validate.js';

import data from '../lib/data';

const validate = (permission) => {
  return validator(permission, {
    name: {
      presence: true,
      format: {
        pattern: /^[a-z0-9_\-]+$/,
        message: 'Only lowercase characters, numbers and "-", "_" are allowed.'
      },
      length: {
        minimum: 3,
        tooShort: 'Please enter a name with at least 3 characters.'
      }
    },
    description: {
      presence: true
    },
    client_id: {
      presence: true
    }
  });
};

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    data.getPermissions()
      .then(permissions => res.json(permissions))
      .catch(next);
  });

  api.get('/:name', (req, res, next) => {
    data.getPermission(req.params.name)
      .then(permission => res.json(permission))
      .catch(next);
  });

  api.post('/', (req, res, next) => {
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let permission = req.body;
    data.createPermission(permission)
      .then(() => res.sendStatus(201))
      .catch(next);
  });

  api.put('/:name', (req, res, next) => {
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let permission = req.body;
    data.updatePermission(req.params.name, permission)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.delete('/:name', (req, res, next) => {
    data.deletePermission(req.params.name)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  return api;
};
