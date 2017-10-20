import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import RecoverPassword from '@/components/RecoverPassword.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('RecoverPassword', () => {
  let component
  let store

  beforeEach(() => {
    const router = new VueRouter()
    store = new Vuex.Store({
      state: {
        loggedIn: false,
        userName: 'testUser',
        User: new Classes.User()
      }
    })
    component = new Vue({
      template: '<div><test></test></div>',
      components: {
        'test': RecoverPassword
      },
      store: store,
      router: router
    }).$mount()
    RecoverPassword.$store = store
  })

  describe('RecoverPassword - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof RecoverPassword.data).to.equal('function')
      const data = RecoverPassword.data()
      expect(data.Email).to.equal('')
      expect(data.NewPassword).to.equal('')
      expect(data.VerifyNewPassword).to.equal('')
      expect(data.failureMessage).to.equal('')
    })
  })

  describe('RecoverPassword - sendEmail', () => {
    it('sendEmail is a function', () => {
      expect(typeof RecoverPassword.methods.sendEmail).to.equal('function')
    })

    it('sendEmail does not throw a error', () => {
      component.$children[0].sendEmail()
    })
  })

  describe('RecoverPassword - reset', () => {
    it('reset is a function', () => {
      expect(typeof RecoverPassword.methods.reset).to.equal('function')
    })

    it('reset does not throw a error', () => {
      component.$children[0].reset()
    })
  })
})
