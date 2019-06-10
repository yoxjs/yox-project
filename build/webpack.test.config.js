const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')

module.exports = merge(
  baseConfig.create(true),
  baseConfig.loadStyle(true, false),
  {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
      // 是否压缩 js
      minimize: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': require('../config/test.env.js')
      }),
    ]
  }
)
