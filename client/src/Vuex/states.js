import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    userName: ''
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
      return state.loggedIn
    }
  }
})
