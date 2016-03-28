const nconf = require('nconf');
const Webtask = require('webtask-tools');
const StorageProviders = require('./lib/storage/providers');

module.exports = Webtask.fromExpress((req, res) => {
  nconf.defaults({
    AUTHORIZE_API_KEY: req.webtaskContext.secrets.EXTENSION_SECRET,
    AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
    AUTH0_APIV2_TOKEN: req.webtaskContext.secrets.AUTH0_APIV2_TOKEN,
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'production',
    HOSTING_ENV: 'webtask'
  });

  // Start the server.
  const initServer = require('./server');
  const app = initServer({
    storageProvider: new StorageProviders.WebtaskStorageProvider({
      storageContext: req.webtaskContext.storage
    })
  });
  return app(req, res);
});
