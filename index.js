const path = require('path');
const nconf = require('nconf');

const logger = require('./server/lib/logger');

// Initialize babel.
require('@babel/register')({
  ignore: [ /node_modules/ ],
  sourceMaps: !(process.env.NODE_ENV === 'production')
});

// Require after @babel/register so the ESM/JSX server code transpiles.
const initHapiServer = require('./server/init').default;

// Initialize configuration.
nconf
  .argv()
  .env()
  .file(path.join(__dirname, './server/config.json'))
  .defaults({
    AUTH0_RTA: 'auth0.auth0.com',
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'development',
    HOSTING_ENV: 'default',
    PORT: 3001,
    USE_OAUTH2: false,
    LOG_COLOR: true
  });

// Start the server.
initHapiServer((key) => nconf.get(key), null)
  .then((server) => server.start().then(() => {
    logger.info('Server running at:', server.info.uri);
  }))
  .catch((err) => logger.error(err));
