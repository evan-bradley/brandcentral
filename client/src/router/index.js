import Vue from 'vue'
import Router from 'vue-router'
import LogIn from '@/components/LogIn'
import Register from '@/components/Register'
import Profile from '@/components/Profile'
import Verify from '@/components/Verify'
import Home from '@/components/Home'
import EditProfile from '@/components/EditProfile'
import ChangePassword from '@/components/ChangePassword'
import ProfileHome from '@/components/ProfileHome'
import ChangeEmail from '@/components/ChangeEmail'
import ResetPassword from '@/components/RecoverPassword'
import LikedProducts from '@/components/LikedProducts'
var store = require('../Vuex/states')
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileHome,
      children: [
        {
          path: '',
          name: 'Profile',
          component: Profile
        },
        {
          path: '/edit',
          name: 'EditProfile',
          component: EditProfile
        },
        {
          path: '/ChangePassword',
          name: 'ChangePassword',
          component: ChangePassword
        },
        {
          path: '/ChangeEmail',
          name: 'ChangeEmail',
          component: ChangeEmail
        }
      ]
    },
    {
      path: '/LikedProducts',
      name: 'LikedProducts',
      component: LikedProducts
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
      path: '/reset/:token',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true
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
  console.log(to.path)
  if (!store.default.state.loggedIn && (to.path !== '/register' && to.path !== '/reset' && to.path.indexOf('/reset') === -1 && to.path !== '/login' && to.path.indexOf('/verify') === -1)) {
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
