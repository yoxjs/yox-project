const path = require('path')

const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { author, license } = require('../package.json')

const banner = `(c) ${new Date().getFullYear()} ${author}\n`
             + `Released under the ${license} License.`

const baseDir = path.resolve(__dirname, '..')

const srcDir = path.resolve(baseDir, 'src')
const viewDir = path.resolve(baseDir, 'view')
const distDir = path.resolve(baseDir, 'dist')

const modulesDir = path.resolve(baseDir, 'node_modules')
const yoxDir = path.resolve(modulesDir, 'yox', 'dist')

function getFileLoaderOptions(hashType, outputPath, publicPath) {
  return {
    name: `[${hashType}].[ext]`,
    outputPath,
    publicPath,
  }
}

function getUrlLoaderOptions(hashType, outputPath, publicPath, limit) {
  const options = getFileLoaderOptions(hashType, outputPath, publicPath)
  options.limit = limit
  return options
}

function getFilename(dirname, filename) {
  return dirname
    ? dirname + path.sep + filename
    : filename
}

// 入口页面，必须放在 viewDir 目录下
const pages = [
  {
    page: path.resolve(viewDir, 'index.html'),
    entry: 'app'
  },
  {
    page: path.resolve(viewDir, 'login.html'),
    entry: 'login'
  }
]

exports.create = function (env) {

  // 配置一些常用的目录别名
  const alias = {
    // 比如 import('@src/a') 实际会导入 src/a
    '@src': srcDir,

    // 比如 import('@common/a') 实际会导入 src/common/a
    '@common': path.resolve(srcDir, 'common'),

    // 如果开启压缩，Yox 使用 runtime 版本
    'yox': path.resolve(
      yoxDir,
      env.legacy ? 'legacy' : 'standard',
      env.minimize ? 'runtime' : 'dev',
      'yox.esm.js'
    )
  }

  return {
    entry: {
      app: path.resolve(srcDir, 'app.ts'),
      login: path.resolve(srcDir, 'login.ts'),
    },
    output: {
      // 打包文件的输出目录
      path: distDir,
      // 服务器对外公开的访问路径
      publicPath: env.assetPaths.js.public,
      // 代码打包后的文件名
      filename: getFilename(
        env.assetPaths.js.relative,
        `[name].[${env.hashType}].bundle.js`
      ),
      // 非入口文件的文件名
      chunkFilename: getFilename(
        env.assetPaths.js.relative,
        `[name].[${env.hashType}].chunk.js`
      ),
    },
    resolve: {
      alias,

      // modules 的默认值会从当前目录下的 node_modules 目录去找模块
      // 找不到，再去上一级目录下的 node_modules 目录找，以此类推
      // 但是我们并不需要往上找，写死项目根目录的 node_modules 就行了
      modules: [
        modulesDir
      ],

      // 第三方模块，优先使用 jsnext:main 和 module 导入 ES6 模块文件
      mainFields: ['jsnext:main', 'module', 'main'],

      extensions: ['.ts', '.js', '.json'],
    },
    plugins: [
      // 为了保证公共 chunk 的 hash 不变
      new webpack.HashedModuleIdsPlugin(),
      // 开启 Scope Hoisting
      new webpack.optimize.ModuleConcatenationPlugin(),
      // 给输出的文件加上 banner
      new webpack.BannerPlugin(banner),
    ]
  }
}

exports.loadHtml = function (env, minify) {

  const metaOptions = {
    charset: {
      charset: 'UTF-8'
    },
    equiv: {
      'http-equiv': 'X-UA-Compatible',
      content: 'ie=edge,chrome=1'
    },
    viewport: {
      name: 'viewport',
      content: 'initial-scale=1.0,width=device-width,user-scalable=0,maximum-scale=1.0,minimum-scale=1.0'
    },
    formatTel: {
      name: 'format-detection',
      content: 'telephone=no'
    },
    formatEmail: {
      name: 'format-detection',
      content: 'email=no'
    },
    orientation: {
      name: 'screen-orientation',
      content: 'portrait'
    },
    fullscreen: {
      name: 'full-screen',
      content: 'yes'
    },
    x5orientation: {
      name: 'x5-orientation',
      content: 'portrait'
    },
    x5fullscreen: {
      name: 'x5-fullscreen',
      content: 'true'
    },
    x5page: {
      name: 'x5-page-mode',
      content: 'app'
    },
    browsermode: {
      name: 'browsermode',
      content: 'application'
    },
    render: {
      name: 'render',
      content: 'webkit|ie-stand'
    },
    apple: {
      name: 'apple-mobile-web-app-capable',
      content: 'yes'
    },
    msapplication: {
      name: 'msapplication-tap-highlight',
      content: 'no'
    }
  }

  const minifyOptions = {
    // 移除 HTML 中的注释
    removeComments: true,
    // 删除空白符与换行符
    collapseWhitespace: minify,
    // 移除 <script> type 属性
    removeScriptTypeAttributes: true,
    // 压缩内联 CSS
    minifyCSS: minify,
    // 压缩内联 JS
    minifyJS: minify
  }

  return {
    plugins: pages.map(item => {
      return new HtmlWebpackPlugin({
        meta: metaOptions,
        minify: minifyOptions,
        filename: path.relative(viewDir, item.page),
        template: item.page,
        chunks: [item.entry]
      })
    })
  }
}

exports.loadTemplate = function (env) {
  return {
    module: {
      rules: [
        // 预编译 Yox 模板文件，从而可以在线上切换到 runtime 版本
        // 这里采用 .hbs 扩展名，这是 handlebars 模板文件的扩展名
        {
          test: /\.hbs$/i,
          use: 'yox-template-loader',
          include: srcDir
        }
      ]
    }
  }
}

exports.loadScript = function (env) {

  return {
    module: {
      rules: [
        {
          test: /\.ts$/i,
          use: 'ts-loader',
        }
      ]
    }
  }

}

// 想用 eslint 请自己折腾
exports.loadEslint = function (env) {

  return {
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.[t|j]s$/i,
          loader: 'eslint-loader',
          include: srcDir,
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      ]
    }
  }

}

exports.minifyScript = function (env, sourceMap) {
  return {
    optimization: {
      minimizer: [
        new TerserPlugin({ sourceMap: sourceMap })
      ],
    }
  }
}

exports.splitCode = function (env) {
  return {
    optimization: {
      splitChunks: {
        /*
            选择哪些 chunk 进行优化，可选值如下：

            initial 只优化页面加载时就需要的 chunk
            async   只优化异步加载的 chunk
            all     你懂的
        */
        chunks: 'all',
        // 新生成的 chunk 体积大于 10k，太小反而失去了拆分的意义
        minSize: 10 * 1000,
        // 新生成的 chunk 体积没有上限
        maxSize: 0,
        // Minimum number of chunks that must share a module before splitting.
        minChunks: 1,
        // Maximum number of parallel requests when on-demand loading.
        maxAsyncRequests: Infinity,
        // Maximum number of parallel requests at an entry point
        maxInitialRequests: Infinity,

        automaticNameDelimiter: '~',

        // 设置为 true 表示基于 cacheGroups 的 key 和 chunk 自己的名字生成一个新名字
        name: true,

        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // 用函数避免每个包配置一个对象
            name(module) {
              // 获取第三方包名称
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              // 干掉一些特殊字符
              return `vendor.${packageName.replace(/@/g, '')}`
            }
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

exports.loadStyle = function (env, separateStyle, sourceMap) {

  const options = {
    sourceMap: sourceMap
  }

  const loaders = []
  const plugins = []

  // 是否需要分离出样式文件，分离文件可避免 js 加载完成前的白屏
  if (separateStyle) {
    loaders.push({
      loader: MiniCssExtractPlugin.loader,
      options: {
        ...options,
        publicPath: env.assetPaths.style.public,
      }
    })

    const filename = getFilename(
      env.assetPaths.style.relative,
      `[${env.hashType}].css`
    )

    plugins.push(
      new MiniCssExtractPlugin({
        filename: filename,
        chunkFilename: filename,
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

exports.minifyStyle = function (env) {
  return {
    plugins: [
      new OptimizeCssAssetsPlugin({
        // 针对配置中 ExtractTextPlugin 实例导出的文件的文件名运行，而不是源 CSS 文件的文件名。
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          safe: true,
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: false
      })
    ]
  }
}

exports.loadImage = function (env) {

  return {
    module: {
      rules: [
        {
          test: /\.ico$/i,
          use: {
            loader: 'file-loader',
            options: getFileLoaderOptions(
              env.hashType,
              env.assetPaths.icon.relative,
              env.assetPaths.icon.public
            )
          }
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              // 图片小于 env.base64Limit 会转成 base64 图片
              // 图片大于或等于 env.base64Limit 就会切换到 file-loader
              // 并把 options 传给 file-loader
              options: getUrlLoaderOptions(
                env.hashType,
                env.assetPaths.image.relative,
                env.assetPaths.image.public,
                env.base64Limit
              )
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

exports.loadFont = function (env) {
  return {
    module: {
      rules: [
        {
          test: /\.(ttf|eot|woff|woff2)$/i,
          use: {
            loader: 'file-loader',
            options: getFileLoaderOptions(
              env.hashType,
              env.assetPaths.font.relative,
              env.assetPaths.font.public
            )
          }
        }
      ]
    }
  }
}

