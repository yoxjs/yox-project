const path = require('path')

const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

// 把 CSS 抽离到单独的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { author, license } = require('../package.json')

const banner = `(c) ${new Date().getFullYear()} ${author}\n`
             + `Released under the ${license} License.`

const srcDir = path.resolve(__dirname, '..', 'src')
const viewDir = path.resolve(__dirname, '..', 'view')
const distDir = path.resolve(__dirname, '..', 'dist')
const thirdDir = path.resolve(__dirname, '..', 'node_modules')

function getFileLoaderOptions(outputPath) {
  return {
    name: '[hash:10].[ext]',
    outputPath: outputPath,
  }
}

function getUrlLoaderOptions(outputPath, limit) {
  const options = getFileLoaderOptions(outputPath)
  options.limit = limit
  return options
}

exports.create = function () {

  return {
    entry: {
      app: path.resolve(srcDir, 'app.ts')
    },
    output: {
      // 打包文件的输出目录
      path: distDir,
      // path 对应的公开 URL
      publicPath: '/',
      // 代码打包后的文件名
      filename: '[name]-[hash:10].js',
      // 非入口文件的文件名
      chunkFilename: '[name]-[hash:10].chunk.js',
    },
    plugins: [
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
        template: path.resolve(viewDir, 'index.html')
      }),

      // 为了保证公共 chunk 的 hash 不变
      new webpack.HashedModuleIdsPlugin(),

      new webpack.BannerPlugin(banner),

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

exports.loadTemplate = function () {
  return {
    module: {
      rules: [
        // 预编译 Yox 模板文件，从而可以在线上切换到 runtime 版本
        // 这里采用 .hbs 扩展名，这是 handlebars 模板文件的扩展名
        {
          test: /\/src\/.*?\.hbs$/i,
          use: 'yox-template-loader',
          exclude: /node_modules/
        }
      ]
    }
  }
}

exports.loadScript = function () {

  return {
    resolve: {
      extensions: ['.ts', '.js', '.json']
    },
    module: {
      rules: [
        // {
        //   test: /\.ts$/i,
        //   enforce: 'pre',
        //   use: 'eslint-loader',
        //   exclude: /node_modules/,
        //   options: {
        //     formatter: require('eslint-friendly-formatter')
        //   }
        // },
        {
          test: /\.ts$/i,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
  }

}

exports.loadStyle = function (separateStyle, sourceMap) {

  const options = {
    sourceMap: sourceMap
  }

  const loaders = []
  const plugins = []

  // 是否需要分离出样式文件，分离文件可避免 js 加载完成前的白屏
  if (separateStyle) {
    loaders.push({
      loader: MiniCssExtractPlugin.loader,
      options: options
    })
    plugins.push(
      new MiniCssExtractPlugin({
        filename: `style${path.sep}[hash:10].css`,
        chunkFilename: `style${path.sep}[hash:10].css`,
      }),
    )
  }
  else {
    // style-loader 会修改 options...
    loaders.push({
      loader: 'style-loader',
      options: {
        ...options
      }
    })
  }

  loaders.push(
    {
      loader: 'css-loader',
      options: options
    }
  )

  return {
    module: {
      rules: [
        // 有些第三方库，会给 css 加上厂商前缀，为了避免混乱
        // 我们认为 .css 文件是最终形态，因此不加 postcss 了
        {
          test: /\.css$/i,
          use: loaders,
        },
        {
          test: /\.styl$/i,
          use: loaders.concat([
            {
              loader: 'postcss-loader',
              options: options
            },
            {
              loader: 'stylus-loader',
              options: options
            }
          ])
        },
        {
          test: /\.less$/i,
          use: loaders.concat([
            {
              loader: 'postcss-loader',
              options: options
            },
            {
              loader: 'less-loader',
              options: options
            }
          ])
        },
        {
          test: /\.s[a|c]ss$/i,
          use: loaders.concat([
            {
              loader: 'postcss-loader',
              options: options
            },
            {
              loader: 'sass-loader',
              options: options
            }
          ])
        },
      ]
    },
    plugins: plugins
  }

}

exports.loadImage = function () {

  return {
    module: {
      rules: [
        {
          test: /\.ico$/i,
          use: {
            loader: 'file-loader',
            options: getFileLoaderOptions('icon')
          }
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              // 图片小于 1KB 会转成 base64 图片
              // 图片大于或等于 1KB 就会切换到 file-loader
              // 并把 options 传给 file-loader
              options: getUrlLoaderOptions('img', 1000)
            },
            {
              loader: 'image-webpack-loader',
              options: {
                // https://www.npmjs.com/package/imagemin-mozjpeg#options
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // https://www.npmjs.com/package/imagemin-pngquant#options
                pngquant: {
                  quality: '65-80',
                  speed: 4
                },
                // https://www.npmjs.com/package/imagemin-gifsicle#options
                gifsicle: {
                  interlaced: false,
                },
                // https://github.com/svg/svgo#what-it-can-do
                svgo: {

                },
                // https://www.npmjs.com/package/imagemin-webp#options
                webp: {
                  quality: 75
                }
              }
            }
          ]
        },
      ]
    }
  }
}

exports.loadFont = function () {
  return {
    module: {
      rules: [
        {
          test: /\.(ttf|eot|woff|woff2)$/i,
          use: {
            loader: 'file-loader',
            options: getFileLoaderOptions('font')
          }
        }
      ]
    }
  }
}