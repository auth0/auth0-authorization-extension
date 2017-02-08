const url = require('url');
const tools = require('auth0-extension-hapi-tools');

const hapiApp = require('./server/init');
const config = require('./server/lib/config');
const logger = require('./server/lib/logger');
const webtask = require('./server/lib/webtask');

tools.urlHelpers.getBaseUrl = (req) => {
  const originalUrl = url.parse(req.originalUrl || '').pathname || '';
  return url.format({
    protocol: 'https',
    host: req.headers.host,
    pathname: originalUrl.replace(req.path, '').replace(/\/$/g, '')
  });
};

const createServer = tools.createServer((wtConfig, wtStorage) => {
  logger.info('Starting Authorization Extension - Version:', process.env.CLIENT_VERSION);
  logger.info(' > WT_URL:', wtConfig('WT_URL'));
  logger.info(' > PUBLIC_WT_URL:', config('PUBLIC_WT_URL'));
  return hapiApp(wtConfig, wtStorage);
});


module.exports = (context, req, res) => {
  config.setValue('PUBLIC_WT_URL', webtask.getUrl(req));
  if (req.headers['x-forwarded-proto'] ) {
    req.headers['x-forwarded-proto'] = req.headers['x-forwarded-proto'].split(',').shift();
  }
  createServer(context, req, res);
};
