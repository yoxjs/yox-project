const merge = require('../node_modules/webpack-merge/lib')
const path = require('path')

const CleanWebpackPlugin = require('../node_modules/clean-webpack-plugin/dist/clean-webpack-plugin')
const HtmlWebpackPlugin = require('../node_modules/html-webpack-plugin')
const MiniCssExtractPlugin = require('../node_modules/mini-css-extract-plugin/dist/cjs')

const productionConfig = require('./webpack.prod.conf.js')
const devConfig = require('./webpack.dev.conf.js')

const generateConfig = function (env) {

  let htmlLoader = [
    {
      loader: 'yox-template-loader'
    }
  ]
  let cssLoader = [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: [require('../node_modules/autoprefixer/lib/autoprefixer')]
      }
    },
    'stylus-loader'
  ]

  let cssExtractLoader = [
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins: [require('../node_modules/autoprefixer/lib/autoprefixer')]
      }
    },
    'stylus-loader'
  ]

  let styleLoader = 
    env === 'production'
      ? cssExtractLoader
      : cssLoader

  let imageLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 1000, // size <= 1KB
        outputPath: 'images/'
      }
    },
    // img-loader for zip img
    {
      loader: 'image-webpack-loader',
      options: {
        // 压缩 jpg/jpeg 图片
        mozjpeg: {
          progressive: true,
          quality: 65 // 压缩率
        },
        // 压缩 png 图片
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]

  let fontLoader = [
    {
      loader: 'url-loader',
      options: {
        name: '[name]-[hash:5].min.[ext]',
        limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
        publicPath: 'fonts/',
        outputPath: 'fonts/'
      }
    }
  ]

  return {
    entry: {
      main: './src/main.js'
    },
    output: {
      publicPath: env === 'development' ? '/' : './', // js 引用的路径或者 CDN 地址
      path: path.resolve(__dirname, '../', 'dist'), // 打包文件的输出目录
      filename: '[name]-[hash:5].bundle.js', // 代码打包后的文件名
      chunkFilename: '[name]-[hash:5].chunk.js', // 代码拆分后的文件名
    },
    module: {
      rules: [
        { test: /\/src\/.*?\.html$/, use: htmlLoader },
        { test: /\.styl$/, use: styleLoader },
        { 
          test: /\.css$/, 
          use: [
            'style-loader',
            'css-loader'
          ] 
        },
        { test: /\.(png|jpg|jpeg|gif)$/, use: imageLoader },
        { test: /\.(eot|woff2?|ttf|svg)$/, use: fontLoader }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(), // 默认情况下，此插件将删除 webpack output.path 目录中的所有文件，以及每次成功重建后所有未使用的 webpack 资产。
      new HtmlWebpackPlugin({
        // 打包输出HTML
        title: 'Yox 项目',
        minify: {
          // 压缩 HTML 文件
          removeComments: true, // 移除 HTML 中的注释
          collapseWhitespace: true, // 删除空白符与换行符
          minifyCSS: true // 压缩内联 css
        },
        filename: 'index.html', // 生成后的文件名
        template: 'view/index.html' // 根据此模版生成 HTML 文件
      })
    ]
  }
}

module.exports = function (env) {
  let config = env === 'production' ? productionConfig : devConfig 
  return merge(generateConfig(env), config)
}