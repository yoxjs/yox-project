const path = require('path')

const webpack = require('webpack')
const merge = require('webpack-merge')

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const baseConfig = require('./webpack.base.config.js')

const port = 8000

module.exports = merge(
  baseConfig.create(),
  baseConfig.loadTemplate(),
  baseConfig.loadScript(),
  baseConfig.loadStyle(false, true),
  baseConfig.loadImage(),
  baseConfig.loadFont(),
  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, '..', 'dist'),
      host: 'localhost',
      port: port,
      hot: true,
      overlay: true,
      proxy: {
        '/comments': {
          target: 'https://m.weibo.cn',
          changeOrigin: true,
          logLevel: 'debug',
          headers: {
            Cookie: ''
          }
        }
      },
      historyApiFallback: true
    },
    optimization: {
      // 是否压缩 js
      minimize: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': require('../config/dev.env.js')
      }),
      new CaseSensitivePathsPlugin({
        debug: true
      }),
      new webpack.HotModuleReplacementPlugin(),
    ]
  }
)
