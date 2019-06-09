const webpack = require('webpack')

const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map', // 调试源码
  devServer: {
    contentBase: path.join(__dirname, '../dist/'),
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
    new webpack.NamedModulesPlugin()
  ]
}