<template>
    <div class="column is-10">
        <div class="column is-12 columns is-multiline">
            <div class="column is-12 is-size-5">
                <h1 class="title is-size-2.5">Change your email address</h1>
              <div class="field">
                <label class="label">New Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Email" name="email" v-model="EnteredEmail" v-validate="{ required: true, email: true}"/>
                </div>
                <p class="help is-danger" v-show="errors.has('email')">{{ errors.first('email') }}</p>
              </div>
                <div class="field">
                    <label class="label">Current Password</label>
                    <div class="control">
                        <input class="input" type="password" placeholder="Password" v-model="password"  />
                    </div>
                </div>
                <button class="button is-primary" @click="ChangeEmail">Change email address</button>
                <router-link class="button is-pulled-right" :to="{ name: 'EditProfile' }">Cancel</router-link>
            </div>
        </div>
    </div>
</template>

<script>
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
  import EditProfile from './EditProfile'
    export default {
        data(){
            return {
                EnteredEmail: '',
                password: '',
                User: this.$store.state.User,
                EditedUser: _.cloneDeep(this.$store.state.User),
                PasswordChange: new Classes.PasswordVerification(),
                failureMessage: ''
            }
        },

      methods: {
        ChangeEmail() {
          // Quit if any inputs are invalid
          this.$validator.validateAll();
          if (this.errors.any()) {
            return
          }

          const EmailChangeInfo = {
            id: this.$store.state.User.Id,
            NewEmail: this.EnteredEmail,
            currentEmail: this.$store.state.User.Email,
            password: this.password
          }
          if (this.$store.state.User.Password === this.password) {
            // Send a request to the api to update the user's information
            this.$http.post(`/api/profile/ChangeEmail/${this.$store.state.User.Id}`, EmailChangeInfo)
              .then(response => {
                if (response.body.success) {
                    this.$store.state.User.Email = EmailChangeInfo.NewEmail
                  this.$router.push({ name: 'EditProfile' })
                } else {
                  console.log(response)
                  this.failureMessage = response.data.message
                }

              }, response => {
                console.log(response)
              })
          }else{
            this.failureMessage = 'Incorrect Password'
          }
        }
      }
    }
</script>

<style scoped>

</style>
