const CleanWebpackPlugin = require('clean-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config.js')

module.exports = merge(
  baseConfig.create('/'),
  baseConfig.loadHtml(true),
  baseConfig.loadTemplate(),
  baseConfig.loadScript(),
  baseConfig.minifyScript(false),
  baseConfig.loadStyle(true, false),
  baseConfig.minifyStyle(),
  baseConfig.loadImage(),
  baseConfig.loadFont(),
  baseConfig.splitCode(),
  {
    mode: 'production',
    optimization: {
      // 是否压缩 js
      minimize: true,
    },
    plugins: [

      // 清空 output.path 目录
      new CleanWebpackPlugin(),

      new webpack.DefinePlugin({
        'process.env': require('../config/prod.env.js')
      }),

    ]
  }
)