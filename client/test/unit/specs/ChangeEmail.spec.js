import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import ChangeEmail from '@/components/ChangeEmail.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('ChangeEmail', () => {
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
        'test': ChangeEmail
      },
      store: store
    }).$mount()
    ChangeEmail.$store = store
  })

  describe('ChangeEmail - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof ChangeEmail.data).to.equal('function')
      const data = ChangeEmail.data()
      const newUser = new Classes.User()
      expect(data.user).to.deep.equal(newUser)
      expect(data.email).to.equal('')
      expect(data.password).to.equal('')
      expect(data.failureMessage).to.equal('')
    })
  })

  describe('ChangeEmail - changeEmail', () => {
    it('changeEmail is a function', () => {
      expect(typeof ChangeEmail.methods.changeEmail).to.equal('function')
    })

    it('changeEmail does not throw a error', () => {
      component.$children[0].changeEmail()
    })
  })
})
