import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import validator from 'validate.js';

import api from './routes/api';
import htmlRoute from './routes/html';
import logger from './lib/logger';
import { init as initProvider } from './lib/providers';

logger.info(`Starting server...`);

// Initialize before running custom modules.
import nconf from 'nconf';
nconf
  .argv()
  .env()
  .file(path.join(__dirname, 'config.json'))
  .defaults({
    DATA_PROVIDER: 'jsondb',
    JSONDB_PATH: path.join(__dirname, '/db.json'),
    NODE_ENV: 'development',
    PORT: 3000
  });

// Initialize data provider.
initProvider(nconf.get('DATA_PROVIDER'));

// Configure validator.
validator.options = { fullMessages: false };
validator.validators.presence.options = {
  message: (value, attribute) => {
    return `The ${attribute} is required.`;
  }
};

// Initialize the app.
const app = new Express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
  stream: logger.stream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configure routes.
app.use('/api', api());
app.use(Express.static(path.join(__dirname, '../assets')));
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

// Start the server.
const port = nconf.get('PORT');
app.listen(port, (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Listening on http://localhost:${port}.`);
  }
});
