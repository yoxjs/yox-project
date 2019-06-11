const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 压缩 css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseConfig = require('./webpack.base.config.js')

module.exports = merge(
  baseConfig.create(),
  baseConfig.loadTemplate(),
  baseConfig.loadScript(),
  baseConfig.loadStyle(true, false),
  baseConfig.loadImage(),
  baseConfig.loadFont(),
  {
    mode: 'production',
    optimization: {
      // 是否压缩 js
      minimize: false,
    },
    plugins: [

      // 清空 output.path 目录
      new CleanWebpackPlugin(),

      new webpack.DefinePlugin({
        'process.env': require('../config/prod.env.js')
      }),

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
    ]
  }
)