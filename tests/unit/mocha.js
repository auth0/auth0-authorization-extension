/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'test';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('@babel/register')();

// Warm the ESM-only uuid module before babel's transpiled requires hit it
// re-entrantly (otherwise: "Unexpected module status 0").
require('uuid');

// Stub style imports so requiring UI components under Node doesn't try to
// parse CSS/Stylus as JavaScript (webpack handles these in real builds).
const noop = () => ({});
require.extensions['.css'] = noop;
require.extensions['.styl'] = noop;

// The UI package barrel statically requires editor libs that the app never
// uses; webpack alias-stubs them (build/webpack/empty-module.js). Do the same
// here so the barrel loads under Node during tests.
const Module = require('module');
const stubbedModules = [ 'codemirror', 'react-codemirror2', 'react-dropzone' ];
const originalLoad = Module._load;
Module._load = function stubbedLoad(request, parent, isMain) {
  if (stubbedModules.indexOf(request) !== -1) {
    return {};
  }
  return originalLoad.call(this, request, parent, isMain);
};

require('./runner');
require('./initClientTests');
