'use strict';

const webpack = require('webpack');
const path = require('path');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const project = require('../../package.json');
const config = require('./config.base.js');

config.profile = false;

const version = process.env.EXTENSION_VERSION || project.version;

// Update build output to include the hash.
config.output.filename = `auth0-authz.ui.${version}.js`;

config.resolve = {
  extensions: [ '.js', '.jsx' ], // Add '.jsx' to the list of extensions to resolve
  fallback: {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify')
  }
};
config.module = {};
config.module.rules = ([
  {
    test: /\.jsx?$/,
    use: [ { loader: 'babel-loader' } ],
    exclude: path.join(__dirname, '../../node_modules/')
  },
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader'
    ]
  },
  {
    test: /\.styl$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'stylus-loader'
    ]
  },
  { test: /\.m?js/, resolve: { fullySpecified: false } }
]);


// Update plugins for Webpack 5.90.
config.plugins = [
  new MiniCssExtractPlugin({
    filename: `auth0-authz.ui.${version}.css`
  }),
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    'process.env': {
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
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
  new StatsWriterPlugin({
    filename: 'manifest.json',
    transform: function transformData(data) {
      const chunks = {
        app: data.assetsByChunkName.app[1],
        style: data.assetsByChunkName.app[0],
        vendors: `auth0-authz.ui.vendors.${version}.js`
      };
      return JSON.stringify(chunks);
    }
  })
];

config.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        sourceMap: true,
        mangle: true,
        output: {
          comments: false
        },
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      }
    })
  ],
  splitChunks: {
    cacheGroups: {
      defaultVendors: false, // Disable the default vendor splitting
      // Explicitly define a cache group for the manually specified vendor libs
      manualVendors: {
        test: new RegExp(`[\\/]node_modules[\\/](${[
          '@babel/polyfill',
          'axios',
          'classnames',
          'history',
          'immutable',
          'jwt-decode',
          'lodash',
          'moment',
          'react',
          'react-bootstrap',
          'react-dom',
          'react-loader-advanced',
          'react-router',
          'react-redux',
          'redux',
          'redux-form',
          'redux-thunk',
          'redux-logger',
          'redux-promise-middleware',
          'redux-simple-router'
        ].join('|')})[\\/]`),
        chunks: 'all',
        enforce: true, // Ensure this chunk is created
        filename: `auth0-authz.ui.vendors.${version}.js`
      }
    }
  }
};

module.exports = config;
