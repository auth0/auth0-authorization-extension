const tools = require('auth0-extension-hapi-tools');

const hapiApp = require('./server');
const logger = require('./server/lib/logger');

module.exports = tools.createServer((req, config, storage) => {
  logger.info('Starting Authorization Extension - Version:', config('CLIENT_VERSION'));
  return hapiApp(config, storage);
});
