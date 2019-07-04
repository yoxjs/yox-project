const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config.js')
const env = require('../config/test.env.js')

module.exports = merge(
  baseConfig.create(env),
  baseConfig.loadHtml(env, false),
  baseConfig.loadTemplate(env),
  baseConfig.loadScript(env),
  baseConfig.loadStyle(env, true, false),
  baseConfig.loadImage(env),
  baseConfig.loadFont(env),
  baseConfig.splitCode(env),
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
      // 环境变量
      new webpack.DefinePlugin({
        'process.env': env.vars
      }),
    ]
  }
)
