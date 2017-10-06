<template>
  <section class="hero is-fullheight">
    <div v-if="token === '/'">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              <img src="../assets/brand_central_icon.png" style="max-width: 20%">
            </h4>
            <div class="box">
              <h4 class="title has-text-centered is-4">Recover Password</h4>
              <article class="message is-danger" v-show="failureMessage">
                <div class="message-body">
                  {{ failureMessage }}
                </div>
              </article>

              <div class="field">
                <label class="label">Account Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Email" name="email" v-model="Email" v-validate="{ required: true, email: true}"/>
                </div>
                <p class="help is-danger" v-show="errors.has('email')">{{ errors.first('email') }}</p>
              </div>

              <hr>
              <div class="control">
                <button class="button is-primary" @click="SendEmail">Send Email</button>
                <router-link class="button is-pulled-right" :to="{ name: 'Login' }">Cancel</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    <div v-else>
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              <img src="../assets/brand_central_icon.png" style="max-width: 20%">
            </h4>
            <div class="box">
              <h4 class="title has-text-centered is-4">Reset Password</h4>
              <article class="message is-danger" v-show="failureMessage">
                <div class="message-body">
                  {{ failureMessage }}
                </div>
              </article>

              <div class="field">
                <label class="label">New Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="New Password" name="password"  v-model="NewPassword" v-validate="{ required: true, min: 8 }"/>
                </div>
                <p class="help is-danger" v-show="errors.has('password')">{{ errors.first('password') }}</p>
              </div>
              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control">
                  <input class="input" type="password" placeholder="Password confirmation" name="confirm password"  v-model="VerifyNewPassword" v-validate="{ required: true, confirmed: 'password' }"/>
                </div>
                <p class="help is-danger" v-show="errors.has('confirm password')">{{ errors.first('confirm password') }}</p>
              </div>

              <hr>
              <div class="control">
                <button class="button is-primary" @click="Reset">Reset Password</button>
                <router-link class="button is-pulled-right" :to="{ name: 'Login' }">Cancel</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      token: {
        default: ''
      }
    },
    data () {
      return {
        Email: '',
        failureMessage: ''
      }
    },
    methods: {
      SendEmail() {
        // Quit if any inputs are invalid
        this.$validator.validateAll();
        if (this.errors.any()) {
          return
        }

        this.$http.post('/api/password/reset', {
          email: this.Email
        })
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
      },
      Reset() {
        // Quit if any inputs are invalid
        this.$validator.validateAll();
        if (this.errors.any()) {
          return
        }

        this.$http.post(`/api/password/reset/${this.token}`, {
          newPassword: this.NewPassword
        })
          .then(response => { // Success
            if (response.body.success) {
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

