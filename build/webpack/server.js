const log = require('fancy-log');
const colors = require('ansi-colors');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./config.dev.js');
const logger = require('../../server/lib/logger');

// Overwrite logger.
logger.debug = function debug(...args) {
  log([ colors.magenta('[debug]'), Array.prototype.join.call(args, ' ') ].join(' '));
};
logger.info = function info(...args) {
  log([ colors.green('[info]'), Array.prototype.join.call(args, ' ') ].join(' '));
};
logger.error = function error(...args) {
  log([ colors.red('[error]'), Array.prototype.join.call(args, ' ') ].join(' '));
};

const options = {
  hot: true,
  historyApiFallback: true,
  proxy: [
    {
      context: () => true,
      target: {
        port: 3000
      }
    }
  ],
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  devMiddleware: {
    publicPath: 'http://localhost:3001/app/',
    stats: { colors: true }
  }
};

new WebpackDevServer(webpack(config), options)
  .listen(3001, 'localhost',
    (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('Webpack proxy listening on: http://localhost:3001');

        // Start the actual webserver.
        require('../../index');
      }
    });
