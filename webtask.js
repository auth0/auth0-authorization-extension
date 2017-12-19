const tools = require('auth0-extension-hapi-tools');
const config = require('./server/lib/config');
const logger = require('./server/lib/logger');

const factory = (wtConfig, wtStorage) => {
  logger.info('Starting Authorization Extension - Version:', process.env.CLIENT_VERSION);
  logger.info(' > WT_URL:', wtConfig('WT_URL'));
  logger.info(' > PUBLIC_WT_URL:', config('PUBLIC_WT_URL'));
  // Require in place to load the dependency only when needed
  // and avoid Blocked event loop errors
  return require('./server/init')(wtConfig, wtStorage);
};

  // Loading all modules at the beginning takes too much time
  // that causes "Blocked event loop errors"
  // This function is a helper to avoid this type of errors
var createServer = (context, req, res) => {
  // To avoid the  "Blocked event loop" error we delay loading the application module
  setImmediate(() => {
    config.setValue('PUBLIC_WT_URL', tools.urlHelpers.getWebtaskUrl(req));
    // After the application has been initialized we remove the 
    // artificial delay in processing
    createServer = tools.createServer(factory);
    createServer(context, req, res);
  });
};

module.exports = (context, req, res) => {
  createServer(context, req, res);
};
