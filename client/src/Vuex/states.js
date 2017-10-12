import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

export default new Vuex.Store({
  state: {
    loggedIn: false,
    User: new Classes.User()
  },
  mutations: {
    setUser (state, userObject) {
      state.loggedIn = true
      state.User = userObject
    },
    LogOut (state) {
      state.loggedIn = false
      state.User = new Classes.User()
    }
  },
  getters: {
    getUser (state) {
      return state.User
    }
  }
})
