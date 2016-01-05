if (process.env.NODE_ENV === 'production') {
  module.exports = require('./DevTools.production');
} else {
  module.exports = require('./DevTools.development');
}
