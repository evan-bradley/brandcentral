<template>
  <nav v-show="this.$store.state.loggedIn" class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/brand_central_full.png" height="50">
      </a>
    </div>
    <div class="navbar-end">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(User.Email) + '?s=46&d=identicon'" class="profile-image" />
          <p>{{ User.UserName }}</p>
        </a>
        <div class="navbar-dropdown">
          <div class="navbar-item" style="display:block;">
            <b>{{ User.FirstName }} {{ User.LastName }}</b>
            <br> @{{ User.UserName }}
          </div>
          <hr class="navbar-divider">
          <router-link :to="{ name: 'Profile' }" class="navbar-item">Profile</router-link>
          <a class="navbar-item">Settings</a>
          <a class="navbar-item">About</a>
          <hr class="navbar-divider">
          <a class="navbar-item" @click="signOut">Sign out</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var md5 = require('md5')

export default {
  name: 'Navbar',
  data() {
    return {
      User: this.$store.state.User
    }
  },
  methods: {
    signOut() {
      this.$store.commit('LogOut')
      this.$router.push({ name: 'Login' })
    },
    hash(str) {
      return md5(str)
    }
  }
}
</script>
