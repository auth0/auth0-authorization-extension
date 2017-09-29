if (process.env.NODE_ENV === 'production') {
  module.exports = require('./DevTools.production.jsx');
} else {
  module.exports = require('./DevTools.development.jsx');
}
