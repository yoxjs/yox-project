const path = require('path')

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 把 CSS 抽离到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

const prodConfig = require('./webpack.prod.conf.js')
const devConfig = require('./webpack.dev.conf.js')

function getStyleLoader(isDev, sourceMap, language) {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        sourceMap: sourceMap,
        hmr: isDev,
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: sourceMap,
        // 在一个 css 中引入了另一个 css，也会执行上一个 loader，即 postcss
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: sourceMap,
        plugins: [
          autoprefixer,
        ]
      }
    }
  ]
  if (language) {
    loaders.push({
      loader: language + '-loader',
      options: {
        sourceMap: sourceMap
      }
    })
  }
  return loaders
}

const generateConfig = function (env) {

  let isDev = env !== 'production'

  return {
    entry: {
      app: './src/app.js'
    },
    output: {
      // js 引用的路径或者 CDN 地址
      // publicPath: isDev ? '/' : './',
      // 打包文件的输出目录
      path: path.resolve(__dirname, '../', 'dist'),
      // 代码打包后的文件名
      filename: '[name]-[hash:10].js',
      // 非入口文件的文件名
      chunkFilename: '[name]-[hash:10].chunk.js',
    },
    module: {
      rules: [
        // Yox 模板文件，预编译从而可以在线上切换到 runtime 版本
        {
          test: /\/src\/.*?\.html$/,
          use: [
            'yox-template-loader'
          ]
        },
        {
          test: /\.css$/,
          use: getStyleLoader(isDev, isDev)
        },
        {
          test: /\.styl$/,
          use: getStyleLoader(isDev, isDev, 'stylus')
        },
        {
          test: /\.less$/,
          use: getStyleLoader(isDev, isDev, 'less')
        },
        {
          test: /\.s[a|c]ss$/,
          use: getStyleLoader(isDev, isDev, 'sass')
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name]-[hash:5].min.[ext]',
                limit: 1000, // size <= 1KB
                outputPath: 'img/'
              }
            },
            // img-loader for zip img
            {
              loader: 'image-webpack-loader',
              options: {
                // 压缩 jpg/jpeg 图片
                mozjpeg: {
                  // 渐进式加载
                  progressive: true,
                  // 压缩率 0-100
                  quality: 65
                },
                // 压缩 png 图片
                pngquant: {
                  quality: '65-90',
                  speed: 4
                }
              }
            }
          ]
        },
        {
          test: /\.(eot|woff2?|ttf|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name]-[hash:5].min.[ext]',
                limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                publicPath: 'font/',
                outputPath: 'font/'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // 清空 output.path 目录
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        title: 'HTML 文档的 title',
        minify: {
          // 移除 HTML 中的注释
          removeComments: true,
          // 删除空白符与换行符
          collapseWhitespace: true,
          // 移除 <script> type 属性
          removeScriptTypeAttributes: true,
          // 压缩内联 CSS
          minifyCSS: true,
          // 压缩内联 JS
          minifyJS: true
        },
        // 输出文件的文件名，支持子目录，如 sub/index.html
        filename: 'index.html',
        // 根据此模版生成 HTML 文件
        template: 'view/index.html'
      }),

      // 为了保证公共 chunk 的 hash 不变
      new webpack.HashedModuleIdsPlugin(),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: isDev ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
      }),
    ],

    optimization: {
      splitChunks: {
        /*
            选择哪些 chunk 进行优化，可选值如下：

            initial 只优化页面加载时就需要的 chunk
            async   只优化异步加载的 chunk
            all     你懂的
        */
        chunks: 'all',
        // 新生成的 chunk 体积大于 30k，太小反而失去了拆分的意义
        minSize: 30000,
        // 新生成的 chunk 体积没有上限
        maxSize: 0,
        // Minimum number of chunks that must share a module before splitting.
        minChunks: 1,
        // Maximum number of parallel requests when on-demand loading.
        maxAsyncRequests: 10,
        // Maximum number of parallel requests at an entry point
        maxInitialRequests: 3,

        automaticNameDelimiter: '~',

        // 设置为 true 表示基于 cacheGroups 的 key 和 chunk 自己的名字生成一个新名字
        name: true,

        cacheGroups: {
          yox: {
            test: /[\\/]node_modules[\\/]yox[\\/]/,
            priority: 10
          },
          'yox-router': {
            test: /[\\/]node_modules[\\/]yox-router[\\/]/,
            priority: 10
          },
          // node_modules 中的同步模块会被打包到 vendor~*.js
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // 一个 chunk 很可能满足多个缓存组，会被抽取到优先级高的缓存组中
            priority: -10
          },
          // 其他的所有同步模块会被打包到 common~*.js中
          common: {
            minChunks: 2,
            priority: -20,
            // 如果该 chunk 中引用了已经被抽取的 chunk，直接引用该 chunk，不会重复打包代码
            reuseExistingChunk: true
          }
        }
      },
      // 把 webpack runtime 的基础函数提取出来
      runtimeChunk: 'single'
    },

  }
}

module.exports = function (env) {
  let config = env === 'production' ? prodConfig : devConfig
  return webpackMerge(generateConfig(env), config)
}