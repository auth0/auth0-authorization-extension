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
  // proxy: [
  //   {
  //     context: () => true,
  //     target: {
  //       port: 3000
  //     }
  //   }
  // ],
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  devMiddleware: {
    publicPath: 'http://localhost:3001/app/',
    // publicPath: 'http://127.0.0.1:3001/app/',
    stats: { colors: true }
  },
  port: 3001,
  host: '0.0.0.0',
  open: [ '/login' ],
  onListening: function(devServer) {
    if (!devServer) {
      throw new Error('webpack-dev-server is not defined');
    }

    const port = devServer.server.address().port;
    console.log('Listening on port:', port);
  }
};

const server = new WebpackDevServer(options, webpack(config));
  // .listen(3001, 'localhost',
  //   (err) => {
  //     if (err) {
  //       logger.error(err);
  //     } else {
  //       logger.info('Webpack proxy listening on: http://localhost:3001');

  //       // Start the actual webserver.
  //       require('../../index');
  //     }
  //   });


(async () => {
  await server.startCallback(() => {
    logger.info('Webpack proxy listening on: http://localhost:3001');
    require('../../index');
  });
})();
