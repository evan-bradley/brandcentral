import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VotingItem from '@/components/VotingItem.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('VotingItem', () => {
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
        'test': VotingItem
      },
      store: store,
      router: router
    }).$mount()
    VotingItem.$store = store
  })

  describe('VotingItem - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof VotingItem.data).to.equal('function')
      expect(component.$children[0].DisplayMode).to.equal(false)
      expect(component.$children[0].itemName).to.equal('')
      expect(component.$children[0].itemDescription).to.equal('')
      expect(component.$children[0].itemImageURL).to.equal('')
      expect(component.$children[0].itemID).to.equal('')
    })
  })

  describe('VotingItem - previous', () => {
    it('previous is a function', () => {
      expect(typeof VotingItem.methods.previous).to.equal('function')
    })

    it('previous does not throw a error', () => {
      component.$children[0].previous()
    })
  })

  describe('VotingItem - next', () => {
    it('next is a function', () => {
      expect(typeof VotingItem.methods.next).to.equal('function')
    })

    it('next does not throw a error', () => {
      component.$children[0].next()
    })
  })

  describe('VotingItem - like', () => {
    it('like is a function', () => {
      expect(typeof VotingItem.methods.like).to.equal('function')
    })

    it('like does not throw a error', () => {
      component.$children[0].like()
    })
  })

  describe('VotingItem - dislike', () => {
    it('dislike is a function', () => {
      expect(typeof VotingItem.methods.dislike).to.equal('function')
    })

    it('dislike does not throw a error', () => {
      component.$children[0].dislike()
    })
  })
})
