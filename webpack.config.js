/* global __dirname */
const commonConfig = require('./webpack.common.config');
const path = require('path');
const Webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { name, version } = require('./package.json');

const dist = 'dist';

module.exports = Object.assign(commonConfig, {
  entry: './src/index.js',
  mode: 'production',
  output: {
    path: path.join(__dirname, `${dist}`),
    filename: 'app.js',
    library: `${name}`,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  plugins: [new CleanWebpackPlugin([dist]), new Webpack.BannerPlugin(version)],
});
