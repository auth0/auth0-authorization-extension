const config = require('./config.dev.js');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const options = {
  publicPath: 'http://localhost:3001/assets/app/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  proxy: {
    '*': 'http://localhost:3000'
  },

  quiet: false,
  noInfo: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },

  stats: { colors: true },
  headers: { 'Access-Control-Allow-Origin': '*' }
};

new WebpackDevServer(webpack(config), options)
  .listen(3001, 'localhost',
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Development server listening on: http://localhost:3001');
      }
    });
