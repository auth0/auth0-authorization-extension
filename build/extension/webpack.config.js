const _ = require('lodash');
const path = require('path');
const Webpack = require('webpack');
const project = require('../../package.json');
const externalModules = require('./externals');

module.exports = externalModules.then(externals => {
  externals.compatible.async = true;
  externals.compatible.auth0 = true;
  externals.compatible.blipp = true;
  externals.compatible.bluebird = true;
  externals.compatible.boom = 'boom@3.2.2';
  externals.compatible.compression = true;
  externals.compatible.debug = true;
  externals.compatible.delegates = true;
  externals.compatible.depd = true;
  externals.compatible.destroy = true;
  externals.compatible.ejs = true;
  externals.compatible.express = true;
  externals.compatible.good = true;
  externals.compatible.hapi = true;
  externals.compatible.jade = true;
  externals.compatible.joi = true;
  externals.compatible.jsonwebtoken = true;
  externals.compatible.lodash = true;
  externals.compatible.moment = true;
  externals.compatible.morgan = true;
  externals.compatible.ms = true;
  externals.compatible.nconf = true;
  externals.compatible.qs = true;
  externals.compatible.request = true;
  externals.compatible.superagent = true;
  externals.compatible.winston = true;
  externals.compatible.xml2js = true;
  externals.compatible['auth0-extension-hapi-tools'] = 'auth0-extension-hapi-tools@1.2.0';
  externals.compatible['auth0-extension-s3-tools'] = 'auth0-extension-s3-tools@1.1.1';
  externals.compatible['auth0-extension-tools'] = 'auth0-extension-tools@1.2.1';
  externals.compatible['auth0-oauth2-express'] = true;
  externals.compatible['auth0@2.0.0'] = true;
  externals.compatible['aws-sdk'] = 'aws-sdk@2.5.3';
  externals.compatible['body-parser'] = true;
  externals.compatible['express-jwt'] = true;
  externals.compatible['good-console'] = 'good-console@6.1.2';
  externals.compatible['hapi-auth-jwt2'] = true;
  externals.compatible['hapi-swagger'] = 'hapi-swagger@7.4.0';
  externals.compatible['iconv-lite'] = true;
  externals.compatible['json-loader'] = true;
  externals.compatible['jwks-rsa'] = true;
  externals.compatible['lru-cache'] = true;
  externals.compatible['lru-memoizer'] = 'lru-memoizer@1.10.0';
  externals.compatible['mime-db'] = true;
  externals.compatible['mime-types'] = true;
  externals.compatible['node-uuid'] = true;
  externals.compatible['raw-body'] = true;
  externals.compatible['read-all-stream'] = true;
  externals.compatible['type-check'] = true;
  externals.compatible['webtask-tools'] = true;

  // Transform to commonjs.
  Object.keys(externals.compatible).forEach(k => {
    if (typeof externals.compatible[k] === 'string') {
      externals.compatible[k] = `commonjs ${externals.compatible[k]}`;
    } else {
      externals.compatible[k] = `commonjs ${k}`;
    }
  });

  return {
    entry: path.join(__dirname, '../../webtask'),
    target: 'node',
    output: {
      path: './dist',
      filename: `auth0-authz.extension.${project.version}.js`,
      library: true,
      libraryTarget: 'commonjs2'
    },
    externals: externals.compatible,
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: path.join(__dirname, '../../node_modules/')
        },
        { test: /\.json$/, loader: 'json' }
      ]
    },
    plugins: [
      new Webpack.optimize.DedupePlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        minimize: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      }),
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          CLIENT_VERSION: JSON.stringify(project.version),
          WARN_DB_SIZE: 409600,
          MAX_MULTISELECT_USERS: 5,
          MULTISELECT_DEBOUNCE_MS: 250,
          PER_PAGE: 10
        }
      })
    ],
    resolve: {
      modulesDirectories: [ 'node_modules', path.join(__dirname, '../../node_modules/') ],
      root: __dirname,
      alias: {}
    },
    node: false
  };
});
