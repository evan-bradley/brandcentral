<template>
  <div class="column is-8 is-offset-2">
    <div class="column is-12 columns is-multiline" v-show="ChangePassword">
      <div class="column is-12 is-size-5">
        <h1 class="title is-size-2.5">Change your password</h1>
        <div class="field">
          <label class="label">Current password</label>
          <div class="control">
            <input class="input" type="password" placeholder="Current password" v-model="PasswordChange.CurrentPassword" />
          </div>
        </div>
        <div class="field">
          <label class="label">New password</label>
          <div class="control">
            <input class="input" type="password" placeholder="New password" v-model="PasswordChange.NewPassword" />
          </div>
        </div>
        <div class="field">
          <label class="label">Password confirmation</label>
          <div class="control">
            <input class="input" type="password" placeholder="Password confirmation" v-model="PasswordChange.VerifyNewPassword" />
          </div>
        </div>
        <button class="button is-primary" @click="ChangePassword">Change Password</button>
        <router-link class="button is-pulled-right" :to="{ name: 'EditProfile' }">Cancel</router-link>
      </div>
    </div>
  </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
import EditProfile from './EditProfile'

export default {
  name: 'ChangePassword',
  data() {
    return {
      User: this.$store.state.User,
      PasswordChange: new Classes.PasswordVerification()
    }
  },
  components: {
    'EditProfile': EditProfile
  },
  methods: {
    ChangePassword() {
      // TODO: This needs to actually change the password in the database
      if (this.PasswordChange.Verify(this.$store.state.User.Password)) {
        this.$store.state.User.Password = this.PasswordChange.NewPassword
        this.$http.post(`/api/profile/${this.$store.state.User.Id}`, {
          password: this.PasswordChange.NewPassword
        })
        .then(response => {
          console.log(response)
        }, response => {
          console.log(response)
        })
      }
    }
  }
}
</script>
