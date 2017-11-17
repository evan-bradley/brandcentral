<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              <img src="../assets/brand_central_icon.png" style="max-width: 20%">
            </h4>
            <div class="box">
              <h4 class="title has-text-centered is-4">Login</h4>
              <article class="message is-danger" v-show="failureMessage">
                <div class="message-body">
                  {{ failureMessage }}
                </div>
              </article>
              <div class="field">
                <label class="label">Username</label>
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
              <div class="columns is-vcentered">
                <p class="column is-6">
                  <button class="button is-primary" @click="login">
                    Login
                  </button>
                </p>
                <p class="column is-6">
                  <router-link class="is-primary is-pulled-right underline-on-hover" :to="{name: 'resetPassword', params:{token: '/'}}">
                    Forgot password?
                  </router-link>
                </p>
              </div>
            </div>
            <p class="has-text-centered">
              Don't have an account?
              <router-link class="is-primary underline-on-hover" :to="{ name: 'register' }">
                Sign Up
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Register from './Register'
  import ResetPassword from './RecoverPassword'
  import { mapMutations } from 'vuex'
  var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes

  export default {
    name: 'LogIn',
    data () {
      return {
        user: new Classes.User(),
        failureMessage: ''
      }
    },
    components: {
      'ResetPassword': ResetPassword,
      'Register': Register
    },
    methods: {
      ...mapMutations([
        'setUser'
      ]),
      login () {
        if (this.user.UserName !== '' && this.user.Password !== '') {
          const loginInfo = {
            username: this.user.UserName,
            password: this.user.Password
          }

          this.$http.post('/api/login', loginInfo)
            .then(response => { // Success
              if (response.data.success) {
                this.user.Id = response.data.id
                this.user.FirstName = response.data.firstName
                this.user.LastName = response.data.lastName
                this.user.Email = response.data.email
                this.$store.commit('setUser', this.user)
                this.$router.push({ name: 'home' })
              } else {
                this.failureMessage = response.data.message
              }
            }, response => { // Failure
              this.failureMessage = response.data.message
            })
        } else {
          this.failureMessage = 'Username or password cannot be blank'
        }
      }
    }
  }
</script>
