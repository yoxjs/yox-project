const path = require('path')

const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config.js')
const env = require('../config/dev.env.js')

const port = 8000

module.exports = merge(
  baseConfig.create(env),
  baseConfig.loadHtml(env, false),
  baseConfig.loadTemplate(env),
  baseConfig.loadScript(env),
  baseConfig.loadStyle(env, false, true),
  baseConfig.loadImage(env),
  baseConfig.loadFont(env),
  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, '..', 'dist'),
      host: 'localhost',
      port: port,
      hot: true,
      overlay: true,
      proxy: { },
      historyApiFallback: true
    },
    optimization: {
      minimize: env.minimize,
    },
    plugins: [
      // 环境变量
      new webpack.DefinePlugin({
        'process.env': env.vars
      }),
      new webpack.HotModuleReplacementPlugin(),
    ]
  }
)
