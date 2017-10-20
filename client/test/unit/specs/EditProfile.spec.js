import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import EditProfile from '@/components/EditProfile.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('EditProfile', () => {
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

    EditProfile.$store = store

    component = new Vue({
      template: '<div><test></test></div>',
      components: {
        'test': EditProfile
      },
      store: store
    }).$mount()

    component.$children[0].user = new Classes.User()
    component.$children[0].editedUser = new Classes.User()
  })

  describe('EditProfile - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof EditProfile.data).to.equal('function')
      const newUser = new Classes.User()
      expect(component.$children[0].user).to.deep.equal(newUser)
      expect(component.$children[0].editedUser).to.deep.equal(newUser)
    })
  })

  describe('EditProfile - Update', () => {
    it('Update is a function', () => {
      expect(typeof EditProfile.methods.Update).to.equal('function')
    })

    it('Update does not throw a error', () => {
      component.$children[0].Update()
    })
  })
})
