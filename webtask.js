'use latest';

const nconf = require('nconf');
const Webtask = require('webtask-tools');
const logger = require('./server/lib/logger');
const { configProvider } = require('./server/lib/config');

logger.info('Starting webtask.');

module.exports = Webtask.fromExpress((req, res) => {
  nconf
    .defaults({
      AUTHORIZE_API_KEY: req.webtaskContext.secrets.EXTENSION_SECRET,
      AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: req.webtaskContext.secrets.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: req.webtaskContext.secrets.AUTH0_CLIENT_SECRET,
      AUTH0_SCOPES: req.webtaskContext.secrets.AUTH0_SCOPES,
      EXTENSION_SECRET: req.webtaskContext.secrets.EXTENSION_SECRET,
      DATA_CACHE_MAX_AGE: 1000 * 30,
      NODE_ENV: 'production',
      HOSTING_ENV: 'webtask',
      CLIENT_VERSION: process.env.CLIENT_VERSION,
      USE_OAUTH2: true,
      WT_URL: req.webtaskContext.secrets.WT_URL
    });

  // Start the server.
  const initServer = require('./server');

  const app = initServer({
    storageContext: req.webtaskContext.storage,
    configProvider: configProvider.fromWebtaskContext(req.webtaskContext)
  });
  return app(req, res);
});
