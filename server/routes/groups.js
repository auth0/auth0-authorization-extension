import { Router } from 'express';
import validator from 'validate.js';

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

export default (db) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    db.getGroups()
      .then(groups => res.json(groups))
      .catch(next);
  });

  api.get('/:id', (req, res, next) => {
    db.getGroup(req.params.id)
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
    db.createGroup(group)
      .then(() => res.json(group))
      .catch(next);
  });

  api.put('/:id', (req, res, next) => {
    console.log(req.params, req.body);
    const errors = validate(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let group = req.body;
    db.updateGroup(req.params.id, group)
      .then((group) => res.json(group))
      .catch(next);
  });

  api.delete('/:id', (req, res, next) => {
    setTimeout(() => {
      db.deleteGroup(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(next);
      
    }, 3000);
  });

  return api;
};
