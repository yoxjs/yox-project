import Yox from 'yox'

import * as YoxRouter from 'yox-router'
import * as Bell from 'bell-ui'

Yox.use(YoxRouter)
Yox.use(Bell)

import IndexComponent from './index/Index'
import FooComponent from './foo/Foo'
import BarComponent from './bar/Bar'

const router = new YoxRouter.Router({
  el: '#app',
  routes: [
    {
      path: '',
      component: IndexComponent,
    },
    {
      path: '/foo',
      component: FooComponent,
    },
    {
      path: '/bar',
      component: BarComponent,
    }
  ],
  route404: {
    path: '/404',
    component: {
      template: '<div>not found</div>'
    }
  }
})

router.start()
