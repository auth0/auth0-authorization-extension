const path = require('path');
const nconf = require('nconf');
const logger = require('./server/lib/logger');

// Initialize babel.
require('babel-core/register')({
  ignore: /node_modules/,
  sourceMaps: !(process.env.NODE_ENV === 'production')
});
require('babel-polyfill');

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3000,
    USE_OAUTH2: false
  });

// Start the server.
const app = require('./server')();
const port = nconf.get('PORT');
app.listen(port, (error) => {
  if (error) {
    logger.error(error);
  } else {
    logger.info(`Express listening on http://localhost:${port}`);
  }
});
