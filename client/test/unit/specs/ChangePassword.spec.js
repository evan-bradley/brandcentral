import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import ChangePassword from '@/components/ChangePassword.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('ChangePassword', () => {
  let component
  let store

  beforeEach(() => {
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
        'test': ChangePassword
      },
      store: store
    }).$mount()
    ChangePassword.$store = store
  })

  describe('ChangePassword - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof ChangePassword.data).to.equal('function')
      const data = ChangePassword.data()
      const newUser = new Classes.User()
      const passwordVerification = new Classes.PasswordVerification()
      expect(data.user).to.deep.equal(newUser)
      expect(data.passwordVerification).to.deep.equal(passwordVerification)
      expect(data.failureMessage).to.equal('')
    })
  })

  describe('ChangePassword - changeEmail', () => {
    it('changePassword is a function', () => {
      expect(typeof ChangePassword.methods.changePassword).to.equal('function')
    })

    it('changePassword does not throw a error', () => {
      component.$children[0].changePassword()
    })
  })
})
