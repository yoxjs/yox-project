import Yox from 'yox'
import template from './login/Login.hbs'

import validator from './common/validator'

import * as Bell from 'bell-ui'
Yox.use(Bell)

new Yox({
  el: '#app',
  template,
  data: {
    username: '',
    password: '',
  },
  methods: {
    submit() {
      let errors = validator.validate(
        {
          username: this.get('username'),
          password: this.get('password'),
        },
        {
          username: {
            required: true,
            empty: '请输入帐号',
            type: 'string',
          },
          password: {
            required: true,
            empty: false,
            type: 'string',
          }
        },
        {
          username: {
            required: '请输入帐号',
            empty: '帐号不能为空',
          },
          password: {
            required: '请输入密码',
            empty: '密码不能为空',
          }
        }
      )
      this.$refs.form.validate(errors)
      if (errors) {
        return
      }
      this.$message.success(
        {
          content: '登录成功',
        },
        function () {
          location.href = '/'
        }
      )
    }
  }
})