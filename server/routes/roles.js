import { Router } from 'express';
import validator from 'validate.js';

import data from '../lib/data';

const validate = (role) => {
  return validator(role, {
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
    }
  });
};

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    data.getRoles()
      .then(roles => res.json(roles))
      .catch(next);
  });

  api.get('/:name', (req, res, next) => {
    data.getRole(req.params.name)
      .then(role => res.json(role))
      .catch(next);
  });

  api.post('/', (req, res, next) => {
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let role = req.body;
    data.createRole(role)
      .then(() => res.sendStatus(201))
      .catch(next);
  });

  api.put('/:name', (req, res, next) => {
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let role = req.body;
    data.updateRole(req.params.name, role)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.delete('/:name', (req, res, next) => {
    data.deleteRole(req.params.name)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  return api;
};
