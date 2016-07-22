import Express from 'express';
import auth0 from 'auth0-oauth2-express';

import Database from './lib/storage/database';
import { S3Provider } from './lib/storage/providers';
import { init as initDb } from './lib/storage/getdb';

import config from './config';
import logger from './lib/logger';
import createServer from './server';

module.exports = (options = { }) => {
  // Initialize database.
  initDb(new Database({
    provider: options.storageProvider || new S3Provider({
      path: 'auth0-authz.json',
      bucket: config('AWS_S3_BUCKET'),
      keyId: config('AWS_ACCESS_KEY_ID'),
      keySecret: config('AWS_SECRET_ACCESS_KEY')
    })
  }));

  // Initialize the app.
  const app = new Express();

  // Authenticate admins.
  app.use('/admins', auth0({
    clientName: 'Auth0 Authorization Dashboard Extension',
    apiToken: {
      secret: config('AUTHORIZE_API_KEY')
    },
    audience: `https://${config('AUTH0_DOMAIN')}/api/v2/`
  }));

  // Start the server.
  createServer((err, hapi) => {
    hapi.start(() => {
      logger.info('Server running at:', hapi.info.uri);
    });
  });

  return app;
};
