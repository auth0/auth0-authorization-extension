const nconf = require('nconf');
const Webtask = require('webtask-tools');

module.exports = Webtask.fromExpress(function(req, res) {
  nconf.defaults({
    AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
    AUTH0_APIV2_TOKEN: req.webtaskContext.secrets.AUTH0_APIV2_TOKEN,
    DATA_CACHE_MAX_AGE: 1000 * 10,
    NODE_ENV: 'production'
  });

  // Start the server.
  const app = require('./server');
  return app(req, res);
});
