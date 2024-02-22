'use strict';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const webpack = require('webpack');

// const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
// const ExtractTextPlugin = require("extract-text-webpack-plugin");

const project = require('../../package.json');
// const config = require('./config.base.js');

// config.profile = false;

const version = process.env.EXTENSION_VERSION || project.version;

// // Build output, which includes the hash.
// config.output.filename = `auth0-authz.ui.${version}.js`;

// // Development modules.
// config.module.rules.push({
//   test: /\.css$/,
//   use: ExtractTextPlugin.extract({
//     fallback: 'style-loader',
//     use: [ 'css-loader', 'postcss-loader' ]
//   })
// });
// config.module.rules.push({
//   test: /\.styl/,
//   use: ExtractTextPlugin.extract({
//     fallback: 'style-loader',
//     use: [ 'css-loader', 'stylus-loader' ]
//   })
// });

// // Webpack plugins.
// config.plugins = config.plugins.concat([
//   // Extract CSS to a different file, will require additional configuration.
//   new ExtractTextPlugin({
//     filename: `auth0-authz.ui.${version}.css`,
//     allChunks: true
  //   }),
  // new MiniCssExtractPlugin({
  //   filename: `auth0-authz.ui.${version}.css`
  // })

//   // Separate the vendor in a different file.
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'vendors',
  //   filename: `auth0-authz.ui.vendors.${version}.js`
  // })

//   // Compress and uglify the output.
//   new webpack.optimize.UglifyJsPlugin({
//     sourceMap: true,
//     mangle: true,
//     output: {
//       comments: false
//     },
//     compress: {
//       sequences: true,
//       dead_code: true,
//       conditionals: true,
//       booleans: true,
//       unused: true,
//       if_return: true,
//       join_vars: true,
//       drop_console: true
//     }
//   }),

//   // Alternative to StatsWriterPlugin.
//   new StatsWriterPlugin({
//     filename: "manifest.json",
//     transform: function transformData(data) {
//       const chunks = {
//         app: data.assetsByChunkName.app[0],
//         style: data.assetsByChunkName.app[1],
//         vendors: data.assetsByChunkName.vendors[0]
//       };
//       return JSON.stringify(chunks);
//     }
//   })
// ]);

// module.exports = config;

const path = require('path');
// const project = require('../../package.json');

// const version = process.env.EXTENSION_VERSION || project.version;

// Build output, which includes the hash.
module.exports = {
  entry: {
    app: path.resolve(__dirname, '../../client/app.jsx')
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: `auth0-authz.ui.${version}.js`
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `auth0-authz.ui.${version}.css`
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Ensure we're transpiling both JS and JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'stylus-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx' ], // Add '.jsx' to the list of extensions to resolve
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
    // "stream": false
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../../dist')
    },
    compress: true,
    port: 9000
  }
};
