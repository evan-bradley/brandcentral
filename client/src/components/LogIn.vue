<template>
  <div>
    <div class="column is-4 is-offset-4 is-centered" v-show="!showRegistration">
      <h1 class="title">Login</h1>
      <hr>
      <p class="notification is-danger" v-show="logInFailed">Invalid username or password.</p>
      <div class="small-padding">
        <label class="label">Username</label>
        <input class="input" type="text" placeholder="Username" v-model="user.UserName" />
      </div>
      <div class="small-padding">
        <label class="label">Password</label>
        <input class="input" type="password" placeholder="Password" v-model="user.Password" @keydown.enter="login" />
      </div>
      <a @click="showRegistration = true">
        <p>Register Now!</p>
      </a>
      <button class="button is-primary large-margins" v-on:click="login">Log In</button>
    </div>
    <Register v-show="showRegistration" v-on:Registered="registerAndLogIn" v-on:Return="ReturnToLogIn"/>
  </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var router = require('../router/index')
import Register from './Register'

export default {
  name: 'LogIn',
  data() {
    return {
      user: new Classes.User(),
      showRegistration: false,
      logInFailed: false
    }
  },
  components: {
    'Register': Register
  },
  methods: {
    login() {
      if (this.user.UserName !== '' && this.user.Password !== '') {
      this.$store.state.loggedIn = true
      // Doing this for testing Can be removed when replaced wiht php      
       this.$store.state.User.FirstName = 'FirstName'
       this.$store.state.User.LastName = 'LastName'
       this.$store.state.User.Email = 'Email@email.com'
       this.$store.state.User.Password = 'password'
       this.$store.state.User.UserName = 'userName'
       this.$router.replace('/')
      }
      else{
        this.logInFailed = true
      }
    },
    registerAndLogIn(user){
      debugger
      this.showRegistration = false;
      // log in user
    },
    ReturnToLogIn(){
      this.showRegistration = false;
      this.user = new Classes.User()
    }
  }
}
</script>
