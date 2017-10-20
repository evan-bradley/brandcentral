import Vue from 'vue'
import VueResource from 'vue-resource'
import Verify from '@/components/Verify.vue'
import VueRouter from 'vue-router'
import Interests from '@/components/Interests'

Vue.use(VueResource)
Vue.use(VueRouter)

Vue.http.interceptors.unshift((request, next) => {
  if (request.url === '/api/verify') {
    next(request.respondWith({ status: 200 }))
  }
})

describe('Register', () => {
  var component

  beforeEach(() => {
    const router = new VueRouter({routes: [
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
      }
    ]})

    component = new Vue({
      template: '<div><test></test></div>',
      router: router,
      components: {
        'test': Verify
      }
    }).$mount()
  })

  describe('Register - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof Verify.data).to.equal('function')
      const data = Verify.data()
      expect(data.VerifyDisplayFlags.Loading).to.equal(true)
      expect(data.VerifyDisplayFlags.Failed).to.equal(false)
      expect(data.code).to.equal('')
      expect(data.failureMessage).to.equal('')
    })
  })

  describe('Register - verify', () => {
    it('verify is a function', () => {
      expect(typeof Verify.methods.verify).to.equal('function')
    })

    it('verify works correctly', () => {
      expect(component.$children[0].VerifyDisplayFlags.Loading).to.equal(true)
      expect(component.$children[0].VerifyDisplayFlags.Failed).to.equal(false)
      expect(component.$children[0].code).to.equal('')
      expect(component.$children[0].failureMessage).to.equal('')

      component.$children[0].verify()
    })
  })
})
