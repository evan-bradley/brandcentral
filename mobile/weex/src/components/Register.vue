<template>
  <div class="hero is-almost-fulheight">
    <div class="hero-body" style="padding: 10px 24px;">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-4 is-offset-4">
            <!--<h4 class="title has-text-centered is-4">
               <img src="../Assets/brand_central_icon.png" style="max-width: 20%"> 
            </h4>-->
            <div class="box">
              <h4 class="title has-text-centered is-4">Register Account</h4>
              <article class="message is-danger" v-show="failureMessage">
                <div class="message-body">
                  {{ failureMessage }}
                </div>
              </article>
              <div class="field">
                <label class="label">First Name</label>
                <div class="control">
                  <input class="input" type="text" placeholder="First Name" v-model="user.FirstName" />
                </div>
              </div>
              <div class="field">
                <label class="label">Last Name</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Last Name" v-model="user.LastName" />
                </div>
              </div>
              <div class="field">
                <label class="label">Username</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Username" name="username" v-model="user.UserName" />
                </div>
                <p class="help is-danger"></p>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Email" name="email" v-model="user.Email" />
                </div>
                <p class="help is-danger"></p>
              </div>
              <hr>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="Password" name="password" v-model="user.Password" />
                </div>
                <p class="help is-danger" ></p>
              </div>
              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="Confirm Password" name="confirm password"v-model="confirmPassword" @keydown.enter="login" />
                </div>
                <p class="help is-danger" ></p>
              </div>
              <hr>
              <div class="control">
                <button class="button is-primary" @click="register">Register</button>
              </div>
            </div>
            <p class="has-text-centered">
                Already have an account?
                <a v-on:click="navigate(1)"><u>Login</u></a> 
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
  var instance = axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/https://brandcentral.xyz',
    timeout: 1000,
  })

  export default {
    name: 'Register',
    data () {
      return {
        user: new Classes.User(),
        confirmPassword: '',
        failureMessage: ''
      }
    },
    methods: {
      register () {
        // Basic validation
        if (this.user.UserName === '') {
          this.failureMessage = 'Username cannot be blank'
          return
        }
        if (this.user.Password !== this.confirmPassword) {
          this.failureMessage = 'Passwords must match'
          return
        }
        // Everything looks okay
        const registration = {
          username: this.user.UserName,
          firstName: this.user.FirstName,
          lastName: this.user.LastName,
          password: this.user.Password,
          email: this.user.Email
        }
        instance.post(this.baseURL + '/api/register', registration)
          .then(response => { // Success
            if (response.data.success) {
              this.$router.push({ name: 'Verify' })
            } else {
              console.log(response)
              this.failureMessage = response.data.message
            }
          }, response => { // Error
            console.log(response)
            this.failureMessage = response.data.message
          })
      },
      navigate (number) {
        this.$emit('navigate', number)
      }
    }
  }
</script>
