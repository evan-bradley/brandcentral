import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import LogIn from '@/components/LogIn.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('LogIn', () => {
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
        'test': LogIn
      },
      store: store
    }).$mount()
    LogIn.$store = store
  })

  describe('LogIn - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof LogIn.data).to.equal('function')
      const data = LogIn.data()
      const newUser = new Classes.User()
      expect(data.user).to.deep.equal(newUser)
      expect(data.failureMessage).to.equal('')
    })
  })

  describe('LogIn - login', () => {
    it('login is a function', () => {
      expect(typeof LogIn.methods.login).to.equal('function')
    })

    it('login does not throw a error', () => {
      component.$children[0].login()
    })
  })
})
