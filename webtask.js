const tools = require('auth0-extension-hapi-tools');

const hapiApp = require('./server/init');
const config = require('./server/lib/config');
const logger = require('./server/lib/logger');

const createServer = tools.createServer((wtConfig, wtStorage) => {
  logger.info('Starting Authorization Extension - Version:', process.env.CLIENT_VERSION);
  logger.info(' > WT_URL:', wtConfig('WT_URL'));
  logger.info(' > PUBLIC_WT_URL:', config('PUBLIC_WT_URL'));
  return hapiApp(wtConfig, wtStorage);
});

module.exports = (context, req, res) => {
  config.setValue('PUBLIC_WT_URL', tools.urlHelpers.getWebtaskUrl(req));
  createServer(context, req, res);
};
