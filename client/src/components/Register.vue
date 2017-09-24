<template>
    <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              Register Account
            </h4>
            <div class="box">
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
            confirmPassword: ''
        }
    },
    methods: {
        Register() {
            if (this.user.Password === this.confirmPassword && this.user.UserName !== "" && this.UserNameCheck(this.user.UserName)){
                // send to PHP to insert user
                this.$store.state.User = this.user
                this.$emit('Registered', this.user)
            }       
        },
        UserNameCheck(userName){
            // some PHP stuff to check the username
            return true
        }
    }
}
</script>
