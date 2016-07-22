import path from 'path';
import nconf from 'nconf';
import Express from 'express';
import auth0 from 'auth0-oauth2-express';

import Database from './lib/storage/database';
import { S3Provider } from './lib/storage/providers';
import { init as initDb } from './lib/storage/getdb';

import logger from './lib/logger';
import createServer from './server';

module.exports = (options = { }) => {
  // Initialize database.
  initDb(new Database({
    provider: options.storageProvider || new S3Provider({
      path: 'auth0-authz.json',
      bucket: nconf.get('AWS_S3_BUCKET'),
      keyId: nconf.get('AWS_ACCESS_KEY_ID'),
      keySecret: nconf.get('AWS_SECRET_ACCESS_KEY')
    })
  }));

  // Initialize the app.
  const app = new Express();

  // Configure routes.
  app.use('/app', Express.static(path.join(__dirname, '../dist')));

  // Authenticate non-admins.
  app.use('/login', auth0({
    audience: 'urn:auth0-authz',
    scopes: 'read:profile',
    clientId: nconf.get('AUTH0_CLIENT_ID'),
    rootTenantAuthority: `https://${nconf.get('AUTH0_DOMAIN')}`,
    apiToken: {
      secret: nconf.get('AUTHORIZE_API_KEY')
    }
  }));

  // Authenticate admins.
  app.use('/admins', auth0({
    clientName: 'Auth0 Authorization Dashboard Extension',
    apiToken: {
      secret: nconf.get('AUTHORIZE_API_KEY')
    },
    audience: `https://${nconf.get('AUTH0_DOMAIN')}/api/v2/`
  }));

  // Start the server.
  createServer((err, hapi) => {
    hapi.start(() => {
      logger.info('Server running at:', hapi.info.uri);
    });
  });

  return app;
};
