import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

var store = require('../Vuex/states')
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/UserProfile/:UserId',
      name: 'EditUser',
      component: Hello
    },
    {
      path: '/LogIn',
      name: 'Login',
      component: Hello
    }
  ]
})
// export default new Router()

router.beforeEach((to, from, next) => {
  debugger
  if (!store.default.state.loggedIn && to.path !== '/Login') {
    next({ path: '/Login' })
  }
})

export default router
