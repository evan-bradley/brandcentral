import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

export default new Vuex.Store({
  state: {
    loggedIn: false,
    userName: 'testUser',
    User: new Classes.User()
  },
  mutations: {
    LogIn (state, username) {
      state.loggedIn = true
      state.userName = username
    },
    LogOut (state) {
      state.loggedIn = false
      state.username = ''
    }
  },
  getters: {
    getUser (state) {
      return state.User
    }
  }
})
