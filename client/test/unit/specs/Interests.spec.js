import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import Interests from '@/components/Interests.vue'
import VueRouter from 'vue-router'
var Classes = require('../../../src/TypeScriptFolder/Compliled/Classes').Classes

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.http.interceptors.unshift((request, next) => {
  next(request.respondWith({ status: 200 }))
})

describe('Interests', () => {
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
        'test': Interests
      },
      store: store
    }).$mount()
    Interests.$store = store
  })

  describe('Interests - data', () => {
    it('data is a function and returns blanks', () => {
      expect(typeof Interests.data).to.equal('function')
      const data = Interests.data()
      const newUser = new Classes.User()
      expect(data.user).to.deep.equal(newUser)
      expect(data.channels.length).to.equal(0)
      expect(data.selectedChannels.length).to.equal(0)
    })
  })

  describe('Interests - loadChannels', () => {
    it('loadChannels is a function', () => {
      expect(typeof Interests.methods.loadChannels).to.equal('function')
    })

    it('loadChannels does not throw a error', () => {
      component.$children[0].loadChannels()
    })
  })

  describe('Interests - toggleChannelSelection', () => {
    it('toggleChannelSelection is a function', () => {
      expect(typeof Interests.methods.toggleChannelSelection).to.equal('function')
    })

    // it('toggleChannelSelection does not throw a error', () => {
    //   const testObject = {
    //     'CHANNEL_ID': 1
    //   }
    //   component.$children[0].selectedChannels = [2]
    //   component.$children[0].toggleChannelSelection(testObject)
    // })
  })

  describe('Interests - submitChannels', () => {
    it('submitChannels is a function', () => {
      expect(typeof Interests.methods.submitChannels).to.equal('function')
    })

    it('submitChannels does not throw a error', () => {
      component.$children[0].submitChannels()
    })
  })

  describe('Interests - canSubmitChannels', () => {
    it('canSubmitChannels is a function', () => {
      expect(typeof Interests.methods.canSubmitChannels).to.equal('function')
    })

    it('canSubmitChannels does not throw a error', () => {
      component.$children[0].canSubmitChannels()
    })
  })
})
