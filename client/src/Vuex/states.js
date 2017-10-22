import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

export default new Vuex.Store({
  state: {
    loggedIn: false,
    User: new Classes.User(),
    channels: []
  },
  mutations: {
    setUser (state, userObject) {
      state.loggedIn = true
      state.User = userObject
    },
    LogOut (state) {
      state.loggedIn = false
      state.User = new Classes.User()
    },
    setChannels (state, channels) {
      state.channels = channels
    },
    addChannel (state, channel) {
      state.channels.push(channel)
    },
    removeChannel (state, channelId) {
      state.channels = state.channels.filter(function (obj) {
        return obj.id !== channelId
      })
    }
  },
  getters: {
    getUser (state) {
      return state.User
    }
  }
})
