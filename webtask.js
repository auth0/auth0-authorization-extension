const url = require('url');
const tools = require('auth0-extension-hapi-tools');

const hapiApp = require('./server/init');
const logger = require('./server/lib/logger');

tools.urlHelpers.getBaseUrl = (req) => {
  const originalUrl = url.parse(req.originalUrl || '').pathname || '';
  return url.format({
    protocol: 'https',
    host: req.headers.host,
    pathname: originalUrl.replace(req.path, '').replace(/\/$/g, '')
  });
};

module.exports = tools.createServer((config, storage) => {
  logger.info('Starting Authorization Extension - Version:', process.env.CLIENT_VERSION);
  logger.info(' > WT_URL:', config('WT_URL'));
  return hapiApp(config, storage);
});
