import path from 'path';
import jwtDecode from 'jwt-decode';
import Express from 'express';
import morgan from 'morgan';
import nconf from 'nconf';
import bodyParser from 'body-parser';
import validator from 'validate.js';
import auth0 from 'auth0-oauth2-express';

import { init as initDb, getDb } from './lib/storage/getdb';
import Database from './lib/storage/database';
import { S3Provider } from './lib/storage/providers';
import api from './routes/api';
import meta from './routes/meta';
import htmlRoute from './routes/html';
import logger from './lib/logger';

// Initialize data provider.
// import { init as initProvider } from './lib/providers';
// initProvider(nconf.get('DATA_PROVIDER'));

module.exports = (options = { }) => {
  // Configure validator.
  validator.options = { fullMessages: false };
  validator.validators.presence.options = {
    message: (value, attribute) => `The ${attribute} is required.`
  };

  // Initialize database.
  initDb(new Database({
    provider: options.storageProvider || new S3Provider({
      path: 'iam-dashboard.json',
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
  app.use('/meta', meta());

  // Use OAuth2 authorization.
  if (nconf.get('USE_OAUTH2')) {
    // Helper to store the user's token in storage.
    const onUserAuthenticated = (req, res, accessToken, next) => {
      const decodedToken = jwtDecode(accessToken);

      getDb().setToken(decodedToken.sub, { accessToken })
        // next is expecting only one parameter with the error.
        .then(() => {
          next();
        })
        .catch(next);
    };

    // Authenticate non-admins.
    // app.use(auth0({
    //   scopes: nconf.get('AUTH0_SCOPES'),
    //   authenticatedCallback: onUserAuthenticated,
    //   clientId: nconf.get('AUTH0_CLIENT_ID'),
    //   rootTenantAuthority: `https://${nconf.get('AUTH0_DOMAIN')}`,
    //   apiToken: {
    //     secret: nconf.get('AUTHORIZE_API_KEY')
    //   }
    // }));

    // Authenticate admins.
    app.use('/admins', auth0({
      scopes: nconf.get('AUTH0_SCOPES'),
      authenticatedCallback: onUserAuthenticated,
      clientName: 'IAM Dashboard Extension',
      apiToken: {
        secret: nconf.get('AUTHORIZE_API_KEY')
      }
    }));
  }

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use((err, req, res, next) => {
    logger.error(err);

    if (err && err.name === 'NotFoundError') {
      res.status(404);
      return res.json({ error: err.message });
    }

    if (err && err.name === 'ValidationError') {
      res.status(400);
      return res.json({ error: err.message });
    }

    res.status(err.status || 500);
    if (process.env.NODE_ENV === 'production') {
      res.json({
        message: err.message
      });
    } else {
      res.json({
        message: err.message,
        error: {
          message: err.message,
          status: err.status,
          stack: err.stack
        }
      });
    }
  });

  return app;
};
