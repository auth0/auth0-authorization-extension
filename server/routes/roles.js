import { Router } from 'express';
import { validateRole } from '../lib/validate';

export default (db) => {
  const api = Router();

  /*
   * List all roles.
   */
  api.get('/', (req, res, next) => {
    db.getRoles()
      .then(roles => res.json(roles))
      .catch(next);
  });

  /*
   * Get a role.
   */
  api.get('/:id', (req, res, next) => {
    db.getRole(req.params.id)
      .then(role => res.json({ _id: role._id, name: role.name, description: role.description }))
      .catch(next);
  });

  /*
   * Create a new role.
   */
  api.post('/', (req, res, next) => {
    const errors = validateRole(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let role = req.body;
    db.createRole(role)
      .then((created) => res.json(created))
      .catch(next);
  });

  /*
   * Update a role.
   */
  api.put('/:id', (req, res, next) => {
    const errors = validateRole(req.body);
    if (errors) {
      res.status(400);
      return res.json({ errors });
    }

    let role = req.body;
    db.updateRole(req.params.id, role)
      .then((updated) => res.json(updated))
      .catch(next);
  });

  /*
   * Delete a role.
   */
  api.delete('/:id', (req, res, next) => {
    db.deleteRole(req.params.id)
      .then(() => res.sendStatus(204))
      .catch(next);
  });

  /*
   * Get all permissions of a role.
   */
  api.get('/:id/permissions', (req, res, next) => {
    db.getGroup(req.params.id)
      .then(role => role.permissions || [])
      .then(permissions => res.json(permissions))
      .catch(next);
  });

  /*
   * Add one or more permissions to a role.
   */
  api.patch('/:id/permissions', (req, res, next) => {
    if (!Array.isArray(req.body)) {
      res.status(400);
      return res.json({
        code: 'invalid_request',
        message: 'The permissions must be an array.'
      });
    }

    return db.getRole(req.params.id)
      .then(role => {
        const currentRole = role;
        if (!currentRole.permissions) {
          currentRole.permissions = [];
        }

        // Add each permission.
        req.body.forEach((member) => {
          if (currentRole.permissions.indexOf(member) === -1) {
            currentRole.permissions.push(member);
          }
        });

        return db.updateRole(req.params.id, currentRole);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  /*
   * Delete a permission of a role.
   */
  api.delete('/:id/permissions', (req, res, next) => {
    db.getRole(req.params.id)
      .then(role => {
        const index = role.permissions.indexOf(req.body.userId);
        if (index > -1) {
          role.permissions.splice(index, 1);
        }

        return db.updateRole(req.params.id, role);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  return api;
};
