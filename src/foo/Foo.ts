import Yox from 'yox'

import './Foo.styl'
import template from './Foo.hbs'

export default Yox.define({
  template,
  data () {
    return {
      title: 'foo'
    }
  }
})