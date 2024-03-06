const path = require('path');

module.exports = {
  devtool: 'source-map',
  stats: true,

  // The application and the vendor libraries.
  entry: {
    app: path.resolve(__dirname, '../../client/app.jsx')
  },

  target: 'web',

  // Output directory.
  output: {
    path: path.join(__dirname, '../../dist'),
    publicPath: '/app/'
  },

  plugins: [],

  // Module configuration.
  resolve: {
    alias: {
      // React: require('react')
    },
    modules: [ 'node_modules' ],
    extensions: [ '.json', '.js', '.jsx' ]
  }
};
