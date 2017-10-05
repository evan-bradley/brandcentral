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
var store = require('../Vuex/states')
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/profile',
      component: ProfileHome,
      children: [
        {
          path: '/',
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
      ],
      meta: {
        auth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: LogIn,
      meta: {
        auth: false
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        auth: false
      }
    },
    {
      path: '/verify/:GUID',
      name: 'Verify',
      component: Verify,
      props: true,
      meta: {
        auth: false
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        auth: false
      }
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
  if (!store.default.state.loggedIn &&
      to.meta.auth ? to.meta.auth : to.matched[0].meta.auth) {
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
