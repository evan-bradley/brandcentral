<template>
    <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              <img src="../assets/brand_central_icon.png" style="max-width: 20%">
            </h4>
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
                  <input class="input" type="text" placeholder="Username" v-model="user.UserName" />
                </div>
              </div>
              <div class="field">
                <label class="label">Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Email" v-model="user.Email" />
                </div>
              </div>
              <hr>
              <div class="field">
                <label class="label">Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="Password" v-model="user.Password"/>
                </div>
              </div>
              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="Confirm Password" v-model="confirmPassword" @keydown.enter="login"/>
                </div>
              </div>
              <hr>
              <div class="control">
                <button class="button is-primary" @click="Register">Register</button>
              </div>
            </div>
            <p class="has-text-centered">
                Already have an account?
                <router-link :to="{ name: 'Login' }"><u>Login</u></router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

export default {
    name: 'Register',
    data() {
        return {
            user: new Classes.User(),
            confirmPassword: '',
            failureMessage: ''
        }
    },
    methods: {
        Register() {
            // Basic validation
            if (this.user.UserName == ''){
              this.failureMessage = 'Username cannot be blank'
              return
            }
            if (this.user.Password !== this.confirmPassword){
              this.failureMessage = 'Passwords must match'
              return
            }
            // Everything looks okay
            const registration = {
                username: this.user.UserName,
                firstName: this.user.FirstName,
                lastName: this.user.LastName,
                password: this.user.Password,
                email: this.user.Email,
            }
            this.$http.post('/api/register', registration)
                .then(response => { // Success
                    if (response.data.success) {
                      this.$router.push({ name: 'Login' })
                    } else {
                      console.log(response)
                      this.failureMessage = response.data.message
                    }
                }, response => { // Error
                    console.log(response)
                    this.failureMessage = response.data.message
                })
        }
    }
}
</script>
