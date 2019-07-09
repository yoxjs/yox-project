module.exports = {

  vars: {
    NODE_ENV: '"development"',
  },

  // 图片小于 1KB 会转成 base64 图片
  base64Limit: 1000,

  // 配置静态资源的路径
  outputPaths: {
    js: {
      // 相对 output.path 的路径
      relative: 'js',
      // 公开访问路径，一般配置 CDN 域名
      public: '/',
    },
    style: {
      relative: 'style',
      public: '/',
    },
    font: {
      relative: 'font',
      public: '/',
    },
    image: {
      relative: 'img',
      public: '/',
    },
    icon: {
      relative: 'icon',
      public: '/',
    }
  }

}