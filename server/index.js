import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import nconf from 'nconf';
import bodyParser from 'body-parser';
import validator from 'validate.js';
import auth0 from 'auth0-oauth2-express';

import api from './routes/api';
import htmlRoute from './routes/html';
import logger from './lib/logger';

logger.info('Starting server...');

// Initialize data provider.
// import { init as initProvider } from './lib/providers';
// initProvider(nconf.get('DATA_PROVIDER'));

// Configure validator.
validator.options = { fullMessages: false };
validator.validators.presence.options = {
  message: (value, attribute) => `The ${attribute} is required.`
};

// Initialize the app.
const app = new Express();
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
  stream: logger.stream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (nconf.get('HOSTING_ENV') === 'webtask') {
  app.use(auth0({
    clientName: 'IAM Dashboard Extension',
    scopes: 'read:connections read:users read:clients'
  }));
}

// Configure routes.
app.use('/api', api());
app.use('/app', Express.static(path.join(__dirname, '../dist')));
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

module.exports = app;
