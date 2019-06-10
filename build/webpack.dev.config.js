const webpack = require('webpack')
const merge = require('webpack-merge')

const path = require('path')
const baseConfig = require('./webpack.base.config.js')

module.exports = merge(
  baseConfig.create(true),
  {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, '..', 'dist'),
      port: 8000,
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
      new webpack.HotModuleReplacementPlugin(),
    ]
  }
)
