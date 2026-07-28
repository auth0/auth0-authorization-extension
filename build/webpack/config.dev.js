'use strict';

const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const WEBPACK_HOST = 'localhost';
const WEBPACK_PORT = 3000;

// Override base configuration.
const config = require('./config.base.js');

config.devtool = 'eval-source-map';
config.entry = [
  `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
  'webpack/hot/only-dev-server',
  config.entry.app
];
config.output.publicPath = `http://localhost:3000${config.output.publicPath}`;

// Stats configuration.
config.stats = {
  colors: true,
  reasons: true
};

config.resolve.fallback = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify')
};

config.module = {
  rules: [
    {
      test: /\.jsx?$/,
      use: [ { loader: 'babel-loader' } ],
      exclude: path.join(__dirname, '../../node_modules/')
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        path.resolve(__dirname, './fix-extension-ui-css-loader.js')
      ]
    },
    {
      test: /\.styl$/,
      use: [ 'style-loader', 'css-loader', 'stylus-loader' ]
    },
    { test: /\.m?js/, resolve: { fullySpecified: false } }
  ]
};

// Webpack plugins.
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(true),
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify('development'),
      WARN_DB_SIZE: 409600,
      MAX_MULTISELECT_USERS: 5,
      MULTISELECT_DEBOUNCE_MS: 250,
      PER_PAGE: 10
    },
    __CLIENT__: JSON.stringify(true),
    __SERVER__: JSON.stringify(false)
  }),
  new webpack.ProvidePlugin({
    process: 'process/browser'
  }),
  new NodePolyfillPlugin()
]);


config.mode = 'development';


module.exports = config;
