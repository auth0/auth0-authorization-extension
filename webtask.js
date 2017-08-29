const tools = require('auth0-extension-hapi-tools');

const hapiApp = require('./server/init');
const logger = require('./server/lib/logger');

const createServer = tools.createServer((wtConfig, wtStorage) => {
  logger.info('Starting Authorization Extension - Version:', process.env.CLIENT_VERSION);
  logger.info(' > WT_URL:', wtConfig('WT_URL'));
  return hapiApp(wtConfig, wtStorage);
});

module.exports = (context, req, res) => {
  createServer(context, req, res);
};
