# yox-project

Yox + Yox-Router 模板项目（完善中）

* 支持 `.ts` 或 `.js`，可任选其一
* 支持 `Less/Sass/Stylus` 三种动态样式语言，可任选其一
* Yox 模板文件扩展名为 `.hbs`，因为它是老牌模板引擎 [handlebars](http://handlebarsjs.com/) 的文件扩展名，很多编辑器支持语法高亮，并且它的语法和 Yox 最为接近
* 第三方库尽量使用 `import/export` 模块系统，这样才能支持摇树优化，因此应该用 `lodash-es` 而不是 `lodash`
* 支持三种环境 `dev`、`test`、`prod`，`process.env.NODE_ENV` 分别为 `development`、`test`、`production`

启动本地服务器

```
npm run dev
```

编译测试包

```
npm run test
```

编译线上包

```
npm run prod
```