import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import Browse from '@/components/Browse.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('Browse', () => {
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
        'test': Browse
      },
      store: store
    }).$mount()
    Browse.$store = store
  })

  describe('Browse - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof Browse.data).to.equal('function')
      const data = Browse.data()
      const newUser = new Classes.User()
      expect(data.searchText).to.equal('')
      expect(data.channels.length).to.equal(0)
      expect(data.users[0].id).to.equal(13)
      expect(data.users[0].username).to.equal('jpherkness')
      expect(data.user).to.deep.equal(newUser)
    })
  })

  describe('Browse - loadChannels', () => {
    it('loadChannels is a function', () => {
      expect(typeof Browse.methods.loadChannels).to.equal('function')
    })

    it('loadChannels does not throw a error', () => {
      component.$children[0].loadChannels()
    })
  })
})
