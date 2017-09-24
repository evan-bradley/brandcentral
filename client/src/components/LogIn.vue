<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              Login
            </h4>
            <div class="box">
              <article class="message is-danger" v-show="logInFailed">
                <div class="message-body">
                  Invalid username or password.
                </div>
              </article>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Username" v-model="user.UserName" />
                </div>
              </div>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="Password" v-model="user.Password" @keydown.enter="login"/>
                </div>
              </div>
              <hr>
              <div class="control">
                <button class="button is-primary" @click="login">Login</button>
              </div>
            </div>
            <p class="has-text-centered">
              Don't have an account?
              <router-link :to="{ name: 'Register' }"><u>Register</u></router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var router = require('../router/index')
import Register from './Register'
import { mapMutations } from 'vuex'

export default {
  name: 'LogIn',
  data() {
    return {
      user: new Classes.User()
    }
  },
  components: {
    'Register': Register
  },
  methods: {
    ...mapMutations([
      'setUser'
    ]),
    login() {
      if (this.user.UserName !== '' && this.user.Password !== '') {
        const loginInfo = {
          username: this.user.UserName,
          password: this.user.Password
        }

        this.$http.post('/api/login', loginInfo)
        .then(response => { // Success
          this.user.FirstName = response.data.firstName
          this.user.LastName = response.data.lastName
          this.user.Email = response.data.email
          this.setUser(this.user)
          this.$router.replace('/')
        }, response => { // Failure
          console.log(response)
        })
      }
    }
  }
}
</script>
