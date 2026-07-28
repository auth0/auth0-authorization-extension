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
      // @a0/auth0-extension-ui statically imports these from its barrel for
      // components the app never uses (CodeEditor, DragAndDrop). Stub them so
      // webpack does not need the (uninstalled) packages to resolve the bundle.
      codemirror: path.resolve(__dirname, './empty-module.js'),
      'react-codemirror2': path.resolve(__dirname, './empty-module.js'),
      'react-dropzone': path.resolve(__dirname, './empty-module.js')
    },
    modules: [ 'node_modules' ],
    extensions: [ '.json', '.js', '.jsx' ]
  }
};
