import Vue from 'vue'
import Router from 'vue-router'
import LogIn from '@/components/LogIn'
import Register from '@/components/Register'
import Profile from '@/components/Profile'
import Verify from '@/components/Verify'
import Browse from '@/components/Browse'
import EditProfile from '@/components/EditProfile'
import ChangePassword from '@/components/ChangePassword'
import ProfileHome from '@/components/ProfileHome'
import ChangeEmail from '@/components/ChangeEmail'
import ResetPassword from '@/components/RecoverPassword'
import Interests from '@/components/Interests'
import Trending from '@/components/Trending'
import Channel from '@/components/Channel'
import LikedProducts from '@/components/LikedProducts'
import SubscribedChannels from '@/components/SubscribedChannels'
import FollowingUsers from '@/components/FollowingUsers'
import ProductItem from '@/components/ProductItem'

// var store = require('../Vuex/states')
var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/settings',
      name: 'settings',
      component: ProfileHome,
      children: [
        {
          path: 'profile',
          name: 'editProfile',
          component: EditProfile
        },
        {
          path: 'password',
          name: 'changePassword',
          component: ChangePassword
        },
        {
          path: 'email',
          name: 'changeEmail',
          component: ChangeEmail
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/reset/:token?',
      name: 'resetPassword',
      component: ResetPassword,
      props: true,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/verify/:token?',
      name: 'verify',
      component: Verify,
      props: true,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/interests',
      name: 'interests',
      component: Interests,
      meta: {
        hideNav: true,
        requireAuth: false
      }
    },
    {
      path: '/',
      name: '',
      component: Browse,
      children: [
        {
          path: '/',
          name: 'home',
          component: Trending
        },
        {
          path: 'channel/:channelId',
          name: 'channel',
          props: true,
          component: Channel
        },
        {
          path: 'product/:productId/:channel',
          name: 'product',
          props: true,
          component: ProductItem
        },
        {
          path: 'profile/:userId',
          name: '',
          props: true,
          component: Profile,
          children: [
            {
              path: '/',
              name: 'profile',
              props: true,
              component: LikedProducts
            },
            {
              path: 'channels',
              name: 'channels',
              props: true,
              component: SubscribedChannels
            },
            {
              path: 'following',
              name: 'following',
              props: true,
              component: FollowingUsers
            }
          ]
        }
      ]
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
