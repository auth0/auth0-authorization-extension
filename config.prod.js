const path = require('path');
console.log('dirname', __dirname)
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'client/app.jsx')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
    "crypto": false // Tells webpack not to polyfill the 'crypto' module
    },
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  }
};

