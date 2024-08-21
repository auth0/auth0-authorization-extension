/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test';

require('source-map-support');
// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('@babel/register')();
require('./runner');
require('./initClientTests');
