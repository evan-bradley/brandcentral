<template>
  <div class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              <imag src="../Assets/brand_central_icon.png" style="max-width: 20%" alt="BrandCentral" />
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
              <div class="control">
                <button class="button is-primary" v-on:click="login">Login</button>
              </div>
            </div>
            <p class="has-text-centered">
              Don't have an account?
               <a v-on:click="navigate(2)"><u>Register</u></a> 
            </p>
            <p class="has-text-centered">
              Forgot your password?
              <a v-on:click="navigate(3)"><u>Reset Password</u></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
  var axios = require('axios')

  export default {
    name: 'LogIn',
    data () {
      return {
        user: new Classes.User(),
        failureMessage: ''
      }
    },
    methods: {
      login () {
        if (this.user.UserName !== '' && this.user.Password !== '') {
          const loginInfo = {
            username: this.user.UserName,
            password: this.user.Password
          }

          axios.post('/api/login', loginInfo)
            .then(response => { // Success
              if (response.data.success) {
                this.user.Id = response.data.id
                this.user.FirstName = response.data.firstName
                this.user.LastName = response.data.lastName
                this.user.Email = response.data.email
              } else {
                this.failureMessage = response.data.message
              }
            }, response => { // Failure
              this.failureMessage = response.data.message
            })
        } else {
          this.failureMessage = 'Username or password cannot be blank'
        }
      },
      navigate (number) {
        this.$emit('navigate', number)
      }
    }
  }
</script>
