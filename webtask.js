const nconf = require('nconf');
const Webtask = require('webtask-tools');

const getDb = require('./server/lib/storage/getdb');
const Database = require('./server/lib/storage/database');
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

  getDb.init(new Database({
    provider: new StorageProviders.WebtaskStorageProvider({
      storageContext: req.webtaskContext.storage
    })
  }));

  // Start the server.
  const app = require('./server');
  return app(req, res);
});
