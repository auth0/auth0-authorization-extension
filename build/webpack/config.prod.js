'use strict';

const webpack = require('webpack');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const project = require('../../package.json');
const logger = require('../../server/lib/logger');
logger.info('Running production configuration...');

const config = require('./config.base.js');
config.profile = false;

// Build output, which includes the hash.
config.output.hash = true;
config.output.filename = 'auth0-authz.ui.' + project.version + '.js';

// Development modules.

// Webpack plugins.
config.plugins = config.plugins.concat([
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.optimize.DedupePlugin(),

  // Extract CSS to a different file, will require additional configuration.
  new ExtractTextPlugin('auth0-authz.ui.' + project.version + '.css', {
    allChunks: true
  }),

  // Separate the vender in a different file.
  new webpack.optimize.CommonsChunkPlugin('vendors', 'auth0-authz.ui.vendors.' + project.version + '.js'),

  // Compress and uglify the output.
  new webpack.optimize.UglifyJsPlugin({
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
      drop_console: true,
      warnings: false
    }
  }),

  // Alternative to StatsWriterPlugin.
  new StatsWriterPlugin({
    filename: 'manifest.json',
    transform: function transformData(data) {
      const chunks = {
        app: data.assetsByChunkName.app[0],
        style: data.assetsByChunkName.app[1],
        vendors: data.assetsByChunkName.vendors[0]
      };
      return JSON.stringify(chunks);
    }
  })
]);

module.exports = config;
