const path = require('path');
const webpack = require('webpack');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');

module.exports = {
  devtool: 'cheap-module-source-map',
  stats: false,

  // The application and the vendor libraries.
  entry: {
    app: path.resolve(__dirname, '../../client/app.jsx'),
    vendors: [
      'babel-polyfill',
      'axios',
      'bluebird',
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
    ]
  },

  // Output directory.
  output: {
    path: path.join(__dirname, '../../dist'),
    filename: 'bundle.js',
    publicPath: '/app/'
  },

  // Module configuration.
  resolve: {
    alias: {
      // React: require('react')
    },
    modules: [ 'node_modules' ],
    extensions: [ '.json', '.js', '.jsx' ]
  },

  // Load all modules.
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [ { loader: 'babel-loader' } ],
        exclude: path.join(__dirname, '../../node_modules/')
      },
      {
        test: /\.(png|ttf|svg|jpg|gif)/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(woff|woff2|eot)/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.styl$/,
        use: [ 'style-loader', 'css-loader', 'stylus-loader' ]
      }
    ]
  },

  // Default plugins.
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({
      React: 'react',
      Promise: 'imports-loader?this=>global!exports-loader?global.Promise!bluebird'
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
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [
            poststylus([
              autoprefixer({ browsers: [ 'last 2 versions', 'IE > 8' ] }),
              postcssReporter({ clearMessages: true })
            ])
          ]
        }
      }
    })
  ]
};
