const path = require('path');
const webpack = require('webpack');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');

module.exports = {
  devtool: 'cheap-module-source-map',
  stats: false,
  progress: true,

  // The application and the vendor libraries.
  entry: {
    app: path.resolve(__dirname, '../../client/app.js'),
    vendors: [
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
      React: require('react')
    },
    modulesDirectories: [
      'node_modules'
    ],
    extensions: [ '', '.json', '.js', '.jsx' ]
  },

  // Load all modules.
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: path.join(__dirname, '../../node_modules/')
      },
      {
        test: /\.(png|ttf|svg|jpg|gif)/,
        loader: 'url?limit=8192'
      },
      {
        test: /\.(woff|woff2|eot)/,
        loader: 'url?limit=100000'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },

  // Default plugins.
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      'React': 'react',
      'Promise': 'imports?this=>global!exports?global.Promise!bluebird'
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      },
      __CLIENT__: JSON.stringify(true),
      __SERVER__: JSON.stringify(false)
    })
  ],

  // Postcss configuration.
  stylus: {
    use: [
      poststylus([
        autoprefixer({ browsers: [ 'last 2 versions', 'IE > 8' ] }),
        postcssReporter({ clearMessages: true })
      ])
    ]
  }
};
