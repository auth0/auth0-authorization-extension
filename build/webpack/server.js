const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./config.dev.js');
const logger = require('../../server/lib/logger');

const options = {
  publicPath: 'http://localhost:3000/app/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: [
    {
      context: function(pathname, req) {
        return true;
      },
      target: {
        port: 3001
      }
    }
  ],

  quiet: false,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: { colors: true },
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
};

new WebpackDevServer(webpack(config), options)
  .listen(3000, 'localhost',
    (err) => {
      if (err) {
        logger.error(err);
      } else {
        logger.info('Webpack proxy listening on: http://localhost:3000');

        // Start the actual webserver.
        require('../../index');
      }
    });
