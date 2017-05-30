const path = require('path');

const webpack = require('webpack');

const config =  {
  entry: [  
    path.join(__dirname, '../server/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: 'index.js',
    publicPath: 'http://localhost:3000/scripts/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loaders: [{
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }],
      exclude: /node_modules/
    }]
  },
  target:"node",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}

module.exports = config;
