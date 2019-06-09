import template from './Bar.hbs'
import './Bar.styl'

export default {
  template,
  data() {
    return {
      title: 'bar'
    }
  },
  methods: {
    open() {
      this.$Message.success('恭喜你，这是一条成功消息')
    }
  }
}