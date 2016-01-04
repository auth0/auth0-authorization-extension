import { Router } from 'express';
import validator from 'validate.js';

import data from '../lib/data';

const validate = (group) => {
  return validator(group, {
    name: {
      presence: true,
      length: {
        minimum: 3,
        tooShort: 'Please enter a name with at least 3 characters.'
      }
    }
  });
};

export default () => {
  const api = Router();
  api.get('/', (req, res, next) => {
    data.getGroups()
      .then(groups => res.json(groups))
      .catch(next);
  });

  api.get('/:name', (req, res, next) => {
    data.getGroup(req.params.name)
      .then(group => res.json(group))
      .catch(next);
  });

  api.post('/', (req, res, next) => {
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let group = req.body;
    data.createGroup(group)
      .then(() => res.sendStatus(201))
      .catch(next);
  });

  api.put('/:name', (req, res, next) => {
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let group = req.body;
    data.updateGroup(req.params.name, group)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  api.delete('/:name', (req, res, next) => {
    data.deleteGroup(req.params.name)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  return api;
};
