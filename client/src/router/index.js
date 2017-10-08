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
import Interests from '@/components/Interests'
// var store = require('../Vuex/states')
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/settings',
      name: 'Settings',
      component: ProfileHome,
      children: [
        {
          path: 'profile',
          name: 'EditProfile',
          component: EditProfile
        },
        {
          path: 'password',
          name: 'ChangePassword',
          component: ChangePassword
        },
        {
          path: 'email',
          name: 'ChangeEmail',
          component: ChangeEmail
        }
      ]
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/login',
      name: 'Login',
      component: LogIn,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/reset/:token?',
      name: 'ResetPassword',
      component: ResetPassword,
      props: true,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/verify/:token?',
      name: 'Verify',
      component: Verify,
      props: true,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/interests',
      name: 'Interests',
      component: Interests,
      meta: {
        hideNav: true,
        requireAuth: false
      }
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

// Before each route, we will check to see if their session is authenticated.
// If they are not authenticate, they will be sent back to the login screen.
// If they are authenticated, they can continue.
router.beforeEach((to, from, next) => {
  // An array of routes that do not require authentication
  const noAuthRequired = ['/register', '/login', '/reset']
  if (!noAuthRequired.includes(to.path) &&
    to.path.indexOf('/reset') === -1) {
    // Check to see if a session exists for the user
    Vue.http.get('/api/authenticated')
    .then(response => {
      if (response.data.authenticated) {
        // Store the user from the existing session
        var user = new Classes.User()
        user.Id = response.data.user.id
        user.UserName = response.data.user.username
        user.Email = response.data.user.email
        user.FirstName = response.data.user.firstName
        user.LastName = response.data.user.lastName
        router.app.$store.commit('setUser', user)
        next()
      } else {
        next({ path: '/login' })
      }
    }, response => {
      console.log(response)
      next({ path: '/login' })
    })
  } else {
    next()
  }
})

export default router
