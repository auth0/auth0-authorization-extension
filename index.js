require('babel-core/register')({
  ignore: /node_modules/,
  sourceMaps: (process.env.NODE_ENV === 'production') ? false : true
});
require('babel-polyfill');

// Start server.
require('./server');
