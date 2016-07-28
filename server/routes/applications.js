import _ from 'lodash';
import Promise from 'bluebird';
import { Router } from 'express';
import { managementClient } from '../lib/middlewares';

export default (db) => {
  const api = Router();

  /*
   * Get a list of applications.
   */
  api.get('/', managementClient, (req, res, next) => {
    req.auth0.clients.getAll({ fields: 'client_id,name,callbacks,global' })
      .then(clients => _.chain(clients)
        .filter({ global: false })
        .sortBy((client) => client.name.toLowerCase())
        .value())
      .then(clients => Promise.all([ clients, db.getApplications(), db.getGroups() ]))
      .spread((clients, apps, groups) =>
        clients.map(client => {
          const app = _.find(apps, { _id: client.client_id });
          if (app && app.groups) {
            client.groups = _.filter(groups, (group) => app.groups.indexOf(group._id) > -1)
              .map((group) => ({
                _id: group._id,
                name: group.name,
                description: group.description
              }));
          } else {
            client.groups = [];
          }
          return client;
        })
      )
      .then(clients => _.sortByOrder(clients, [ 'groups.length' ], [ false ]))
      .then(clients => res.json(clients))
      .catch(next);
  });

  /*
   * Get an application.
   */
  api.get('/:id', managementClient, (req, res, next) => {
    req.auth0.clients.get({ client_id: req.params.id })
      .then(client => res.json(client))
      .catch(next);
  });

  /*
   * Get the allowed groups for an application.
   */
  api.get('/:id/groups', (req, res, next) => {
    db.getApplications()
      .then(apps => _.find(apps, { _id: req.params.id }) || { })
      .then(app => {
        app.groups = app.groups || [];
        return app;
      })
      .then(app => db.getGroups()
        .then(groups => _.filter(groups, (group) => app.groups.indexOf(group._id) > -1)))
      .then(groups => groups.map((group) => ({
        _id: group._id,
        name: group.name,
        description: group.description
      })))
      .then(groups => res.json(groups))
      .catch(next);
  });

  /*
   * Add a group to the whitelist of an application.
   */
  api.post('/:id/groups', (req, res, next) => {
    db.getApplications()
      .then(apps => _.find(apps, { _id: req.params.id }) || { })
      .then(app => {
        const currentApp = app;
        if (!currentApp.groups) {
          currentApp.groups = [];
        }

        if (req.body.groupId && currentApp.groups.indexOf(req.body.groupId) === -1) {
          currentApp.groups.push(req.body.groupId);
        }

        return db.updateApplication(req.params.id, currentApp);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  /*
   * Remove a group that is allowed to access an application.
   */
  api.delete('/:id/groups', (req, res, next) => {
    db.getApplications()
      .then(apps => _.find(apps, { _id: req.params.id }) || { })
      .then(app => {
        const index = app.groups.indexOf(req.body.groupId);
        if (index > -1) {
          app.groups.splice(index, 1);
        }

        return db.updateApplication(req.params.id, app);
      })
      .then(() => res.sendStatus(202))
      .catch(next);
  });

  return api;
};
