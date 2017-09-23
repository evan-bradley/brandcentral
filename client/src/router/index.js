import Vue from 'vue'
import Router from 'vue-router'
import LogIn from '@/components/LogIn'
import Blank from '@/components/blank'
import UserHome from '@/components/UserHome'

var store = require('../Vuex/states')
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Blank
    },
    {
      path: '/UserProfile',
      name: 'UserHome',
      component: UserHome
    },
    {
      path: '/LogIn',
      name: 'Login',
      component: LogIn
    }
  ]
})
// export default new Router()

router.beforeEach((to, from, next) => {
  // debugger
  if (!store.default.state.loggedIn && to.path !== '/LogIn') {
    next({ path: '/LogIn' })
  } else {
    next()
  }
})

export default router
