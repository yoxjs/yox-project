import Yox from 'yox'
import * as YoxRouter from 'yox-router'
import * as Bell from 'bell-ui'

import FooComponent from './foo/Foo'
import Foo1Component from './foo/Foo1'
import Foo2Component from './foo/Foo2'
import BarComponent from './bar/Bar'
import 'bell-ui/dist/bell-ui.css'

Yox.use(YoxRouter)
Yox.use(Bell)

var router = new YoxRouter.Router({
  el: '#app',
  routes: [
    {
      path: '',
      redirect: '/foo/1'
    },
    {
      path: '/foo',
      component: FooComponent,
      children: [
        {
          path: '',
          redirect: '/foo/1'
        },
        {
          path: '1',
          component: Foo1Component
        },
        {
          path: '2',
          component: Foo2Component
        }
      ]
    },
    {
      path: '/bar',
      component: BarComponent
    },

    {
      path: '/lazyload',
      load(callback) {
        import(/* webpackChunkName: "./lazyload/route"*/ './lazyload/route').then(
          function (route) {
            callback(route.default)
          }
        )
      }
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
