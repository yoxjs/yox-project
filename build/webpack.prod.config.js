const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config.js')
const env = require('../config/prod.env.js')

module.exports = merge(
  baseConfig.create(env),
  baseConfig.loadHtml(env, true),
  baseConfig.loadTemplate(env),
  baseConfig.loadScript(env),
  baseConfig.minifyScript(env, false),
  baseConfig.loadStyle(env, true, false),
  baseConfig.minifyStyle(env),
  baseConfig.loadImage(env),
  baseConfig.loadFont(env),
  baseConfig.splitCode(env),
  {
    mode: 'production',
    optimization: {
      // 是否压缩 js
      minimize: true,
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