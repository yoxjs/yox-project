const CleanWebpackPlugin = require('clean-webpack-plugin')

const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')

module.exports = merge(
  baseConfig.create(true),
  baseConfig.loadTemplate(),
  baseConfig.loadScript(),
  baseConfig.loadStyle(true, false),
  baseConfig.loadImage(),
  baseConfig.loadFont(),
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
    ]
  }
)
