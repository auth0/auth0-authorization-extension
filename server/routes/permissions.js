import { Router } from 'express';
import { validatePermission } from '../lib/validate';

export default (db) => {
  const api = Router();

  /*
   * List all permissions.
   */
  api.get('/', (req, res, next) => {
    db.getPermissions()
      .then(permissions => res.json(permissions))
      .catch(next);
  });

  /*
   * Get a permission.
   */
  api.get('/:id', (req, res, next) => {
    db.getPermission(req.params.id)
      .then(permission => res.json(permission))
      .catch(next);
  });

  /*
   * Create a new permission.
   */
  api.post('/', (req, res, next) => {
    const errors = validatePermission(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    const permission = req.body;
    return db.createPermission(permission)
      .then((created) => res.json(created))
      .catch(next);
  });

  /*
   * Update a permission.
   */
  api.put('/:id', (req, res, next) => {
    const errors = validatePermission(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    const permission = req.body;
    return db.updatePermission(req.params.id, permission)
      .then((updated) => res.json(updated))
      .catch(next);
  });

  /*
   * Delete a permission.
   */
  api.delete('/:id', (req, res, next) => {
    db.deletePermission(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  return api;
};
