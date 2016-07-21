import path from 'path';
import nconf from 'nconf';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';
import validator from 'validate.js';
import auth0 from 'auth0-oauth2-express';

import Database from './lib/storage/database';
import { S3Provider } from './lib/storage/providers';
import { init as initDb } from './lib/storage/getdb';
import api from './routes/api';
import htmlRoute from './routes/html';
import logger from './lib/logger';
import * as middlewares from './lib/middlewares';

import createServer from './server';

module.exports = (options = { }) => {
  // Configure validator.
  validator.options = { fullMessages: false };
  validator.validators.presence.options = {
    message: (value, attribute) => `The ${attribute} is required.`
  };

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
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure routes.
  app.use('/api', api());
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

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(middlewares.errorHandler);

  // Start the server.
  createServer((err, hapi) => {
    hapi.start(() => {
      logger.info('Server running at:', hapi.info.uri);
    });
  });

  return app;
};
