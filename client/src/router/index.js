import Vue from 'vue'
import Router from 'vue-router'
import LogIn from '@/components/LogIn'
import Register from '@/components/Register'
import Profile from '@/components/Profile'
import Verify from '@/components/Verify'
import Home from '@/components/Home'
import EditProfile from '@/components/EditProfile'
import ChangePassword from '@/components/ChangePassword'

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
      path: '/profile/edit',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/profile/edit/password',
      name: 'ChangePassword',
      component: ChangePassword
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
      path: '/verify/:GUID',
      name: 'Verify',
      component: Verify,
      props: true
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
  console.log(store.default.state)
  if (!store.default.state.loggedIn && (to.path !== '/register' && to.path !== '/login' && to.path.indexOf('/verify') === -1)) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
