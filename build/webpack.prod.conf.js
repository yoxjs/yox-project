const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')

const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
  mode: 'production',
  optimization: {
    // 是否压缩 js
    minimize: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
      cssProcessor: require('cssnano'), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    }),
    // 清除无用 css
    new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, './src/*.js')
      ])
    })
  ]
}