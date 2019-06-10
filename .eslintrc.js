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
        "indent": ["error", 2],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "no-console": "error",
        "arrow-parens": 0
    }
}