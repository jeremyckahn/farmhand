/* global __dirname */
const commonConfig = require('./webpack.common.config');
const path = require('path');

module.exports = Object.assign(commonConfig, {
  entry: {
    tests: './test/index.js',
    demo: './demo/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },
  devServer: {
    port: 9123,
  },
});
