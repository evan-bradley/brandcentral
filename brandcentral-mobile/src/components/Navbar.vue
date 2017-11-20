<template>
<div>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
     <div class="navbar-brand">
      <div class="navbar-burger burger" @click="toggleBurger"
           :class="{ 'is-active': burgerActive }">
         <!-- Note: these spans generate the burger lines -->
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div> 
    <div class="navbar-menu" :class="{ 'is-active': burgerActive }">
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-dropdown is-right">
            <div class="dropdown-item" style="display:block;">
              <b>{{ user.FirstName ? user.FirstName : "" }} {{ user.LastName ? user.LastName : "" }}</b>
              <br> @{{ user.UserName ? user.UserName : ""  }}
            </div>
            <hr class="navbar-divider"> 
            <!-- To Do Later -->
            <!-- <router-link :to="{ name: 'profile', params:{ userId: this.$store.state.User.Id } }"
                         class="dropdown-item">Profile</router-link>
            <router-link :to="{ name: 'editProfile' }" class="dropdown-item">Settings</router-link> -->
            <!-- <a class="navbar-item">About</a> -->
            <!-- about is empty right now. we can add it back when we get something to put here -->
             <hr class="navbar-divider">
            <a class="dropdown-item" @click="signOut">Sign out</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  </div>
</template>

<script>
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
  var axios = require("axios");
  var instance = axios.create({
    baseURL: "https://cors-anywhere.herokuapp.com/https://brandcentral.xyz",
    timeout: 1000
  });

  export default {
    name: 'Navbar',
    data () {
      return {
        burgerActive: false
      }
    },
    props: {
      user: {
        type: Classes.User,
        default: new Classes.User() 
      }
    },
    methods: {
      signOut () {
        instance.get('/api/logout')
          .then(response => {
            this.burgerActive = false
            this.$emit('LogOut')
          }, response => {
            console.log(response)
          })
      },
      toggleBurger () {
        this.burgerActive = !this.burgerActive
      }
    }
  }
</script>
