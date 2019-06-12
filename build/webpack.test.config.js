const CleanWebpackPlugin = require('clean-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')

module.exports = merge(
  baseConfig.create('/'),
  baseConfig.loadHtml(false),
  baseConfig.loadTemplate(),
  baseConfig.loadScript(),
  baseConfig.loadStyle(true, false),
  baseConfig.loadImage(),
  baseConfig.loadFont(),
  baseConfig.splitCode(),
  {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
      // 是否压缩 js
      minimize: false,
    },
    plugins: [
      // 清空 output.path 目录
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': require('../config/test.env.js')
      }),
      new CaseSensitivePathsPlugin({
        debug: true
      }),
    ]
  }
)
