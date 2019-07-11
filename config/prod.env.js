module.exports = {

  // 环境变量
  vars: {
    NODE_ENV: '"production"',
  },

  // 是否压缩
  minimize: true,

  // 图片小于 1KB 会转成 base64 图片
  base64Limit: 1000,

  // 配置静态资源的路径
  // relative: 相对 output.path 的路径
  // public: 公开访问路径，一般配置 CDN 域名
  assetPaths: {
    js: {
      relative: 'js',
      public: '/js/',
    },
    style: {
      relative: 'style',
      public: '/style/',
    },
    font: {
      relative: 'font',
      public: '/font/',
    },
    image: {
      relative: 'img',
      public: '/img/',
    },
    icon: {
      relative: 'icon',
      public: '/icon/',
    }
  },

}