const path = require('path')

const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config.js')

const port = 8000

module.exports = merge(
  baseConfig.create(),
  baseConfig.loadHtml(false),
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
      proxy: { },
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

      new webpack.HotModuleReplacementPlugin(),
    ]
  }
)
