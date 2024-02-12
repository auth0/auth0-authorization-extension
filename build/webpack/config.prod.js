const path = require('path');
const project = require("../../package.json");

const version = process.env.EXTENSION_VERSION || project.version;

// Build output, which includes the hash.
module.exports = {
  entry: {
    app: path.resolve(__dirname, '../../client/app.jsx')
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename : `auth0-authz.ui.${version}.js`,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Ensure we're transpiling both JS and JSX files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.styl$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "stylus-loader",
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Add '.jsx' to the list of extensions to resolve
    fallback: {
    "crypto": require.resolve('crypto-browserify'),
    "stream": require.resolve('stream-browserify'),
    // "stream": false
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../../dist'),
    },
    compress: true,
    port: 9000,
  }
};

