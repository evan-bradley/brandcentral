<template>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-burger left toggle-button">
        <i class="material-icons">menu</i>
      </div>
      <router-link class="navbar-item" :to="{ name: 'home' }">
        <img src="../assets/brand_central_icon.png">
      </router-link>
      <router-link class="navbar-item" :to="{ name: 'home' }">
        Browse
      </router-link>
      <div class="navbar-burger burger" @click="toggleBurger"
           :class="{ 'is-active': burgerActive }">
        <i class="material-icons">more_vert</i>
      </div>
      
    </div>
    <div class="navbar-menu" :class="{ 'is-active': burgerActive }">
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link dropdown-trigger desktop-only">
            <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(this.$store.state.User.Email) + '?s=46&d=identicon'" class="profile-image" />
            <p>{{ this.$store.state.User.UserName }}</p>
          </a>
          <div class="navbar-dropdown is-right">
            <div class="dropdown-item" style="display:block;">
              <b>{{ this.$store.state.User.FirstName }} {{ this.$store.state.User.LastName }}</b>
              <br> @{{ this.$store.state.User.UserName }}
            </div>
            <hr class="navbar-divider">
            <router-link :to="{ name: 'profile', params:{ userId: this.$store.state.User.Id } }"
                         class="dropdown-item">Profile</router-link>
            <router-link :to="{ name: 'editProfile' }" class="dropdown-item">Settings</router-link>
            <!--<a class="navbar-item">About</a>
            about is empty right now. we can add it back when we get something to put here-->
            <hr class="navbar-divider">
            <a class="dropdown-item" @click="signOut">Sign out</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
  var md5 = require('md5')

  export default {
    name: 'Navbar',
    data () {
      return {
        user: this.$store.state.User,
        burgerActive: false
      }
    },
    methods: {
      signOut () {
        this.$http.get('/api/logout')
          .then(response => {
            this.$store.commit('LogOut')
            this.$router.push({ name: 'login' })
          }, response => {
            console.log(response)
          })
      },
      hash (str) {
        return md5(str)
      },
      toggleBurger () {
        this.burgerActive = !this.burgerActive
      }
    }
  }
</script>
