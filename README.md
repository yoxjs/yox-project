# yox-project

Yox + Yox-Router 模板项目（完善中，不要用...）

* 强制使用 `TypeScript` 进行项目开发（何苦用 Babel 呢）
* 支持 `Less/Sass/Stylus` 三种动态样式语言，可任选其一
* Yox 模板文件扩展名为 `.hbs`，因为它是老牌模板引擎 [handlebars](http://handlebarsjs.com/) 的文件扩展名，很多编辑器支持语法高亮，并且它的语法和 Yox 最为接近
* 第三方库尽量使用 `import/export` 模块系统，这样才能支持摇树优化，因此应该用 `lodash-es` 而不是 `lodash`
* 支持三个环境 `dev`、`test`、`prod`，`process.env.NODE_ENV` 分别为 `development`、`test`、`production`