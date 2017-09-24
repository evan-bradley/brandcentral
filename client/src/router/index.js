import Vue from 'vue'
import Router from 'vue-router'
import LogIn from '@/components/LogIn'
import Register from '@/components/Register'
import Profile from '@/components/Profile'
import Home from '@/components/Home'

var store = require('../Vuex/states')
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/login',
      name: 'Login',
      component: LogIn
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
// export default new Router()

router.beforeEach((to, from, next) => {
  // debugger
  if ((!store.default.state.loggedIn && (to.path !== '/register' && to.path !== '/login')) && to.matched[0].name !== 'Verify') {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
