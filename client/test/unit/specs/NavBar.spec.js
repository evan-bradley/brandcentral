import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import NavBar from '@/components/NavBar.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('NavBar', () => {
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
        'test': NavBar
      },
      store: store
    }).$mount()
    NavBar.$store = store
  })

  describe('NavBar - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof NavBar.data).to.equal('function')
      const data = NavBar.data()
      const newUser = new Classes.User()
      expect(data.user).to.deep.equal(newUser)
    })
  })

  describe('NavBar - signOut', () => {
    it('signOut is a function', () => {
      expect(typeof NavBar.methods.signOut).to.equal('function')
    })

    it('signOut does not throw a error', () => {
      component.$children[0].signOut()
    })
  })

  describe('NavBar - hash', () => {
    var testEmail = 'test@gmail.com'
    var hashValue = '1aedb8d9dc4751e229a335e371db8058'

    it('hash is a function', () => {
      expect(typeof NavBar.methods.hash).to.equal('function')
    })

    it('the hash should be unique', () => {
      const firstHash = component.$children[0].hash('testing')
      const secondHash = component.$children[0].hash('not testing')
      expect(firstHash).to.not.equal(secondHash)
    })

    it('the hash should be reproducible', () => {
      const firstHash = component.$children[0].hash('testing')
      const secondHash = component.$children[0].hash('testing')
      expect(firstHash).to.equal(secondHash)
    })

    it('the hash should generate an md5 hash', () => {
      expect(component.$children[0].hash(testEmail)).to.equal(hashValue)
    })
  })
})
