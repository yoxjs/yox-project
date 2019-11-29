// http://eslint.cn/docs/user-guide
module.exports = {
  root: true,
  extends: 'eslint:recommended',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // http://eslint.cn/docs/rules/
  rules: {
    // 缩进两空格
    "indent": ["error", 2],
    // 单引号
    "quotes": ["error", "single"],
    // 不要分号
    "semi": ["error", "never"],
    // 使用 UNIX 换行符
    "linebreak-style": ["error", "unix"],

    // 对象禁止重复的 key
    "no-dupe-keys": "error",
    "no-console": "off",
    "no-debugger": "error",
    "arrow-parens": 0
  }
}