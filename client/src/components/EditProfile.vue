<template>
  <div class="column is-10">
    <div class="column is-12 columns is-multiline">
      <div class="column is-12 is-size-5">
        <h1 class="title is-size-2.5">Edit your profile</h1>
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input class="input" type="text" v-bind:placeholder="User.UserName" name="username" v-model="EditedUser.UserName" v-validate="{ required: true }"/>
          </div>
          <p class="help is-danger" v-show="errors.has('username')">{{ errors.first('username') }}</p>
        </div>
        <div class="field">
          <label class="label">First Name</label>
          <div class="control">
            <input class="input" type="text" v-bind:placeholder="User.FirstName" v-model="EditedUser.FirstName" />
          </div>
        </div>
        <div class="field">
          <label class="label">Last Name</label>
          <div class="control">
            <input class="input" type="text" v-bind:placeholder="User.LastName" v-model="EditedUser.LastName" />
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="text" v-bind:placeholder="User.Email" name="email" v-model="EditedUser.Email" v-validate="{ required: true, email: true }"/>
          </div>
          <p class="help is-danger" v-show="errors.has('email')">{{ errors.first('email') }}</p>
        </div>        
        <button class="button is-primary" @click="Update">Update profile</button>
        <router-link class="button is-pulled-right" :to="{ name: 'Profile' }">Cancel</router-link>
      </div>
    </div>
  </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
import Profile from './Profile'
import ChangePassword from './ChangePassword'

export default {
  name: 'EditProfile',
  data() {
    return {
      User: this.$store.state.User,
      EditedUser: _.cloneDeep(this.$store.state.User)
    }
  },
  components: {
    'Profile': Profile,
    'ChangePassword': ChangePassword
  },
  methods: {
    Update() {
      // Quit if any inputs are invalid
      this.$validator.validateAll();
      if (this.errors.any()) {
          return
      }

      const updateInfo = {}

      if (this.$store.state.User.UserName !== this.EditedUser.UserName) {
        updateInfo.username = this.EditedUser.UserName
        this.$store.state.User.UserName = this.EditedUser.UserName
      }

      if (this.$store.state.User.FirstName !== this.EditedUser.FirstName) {
        updateInfo.firstName = this.EditedUser.FirstName
        this.$store.state.User.FirstName = this.EditedUser.FirstName
      }

      if (this.$store.state.User.LastName !== this.EditedUser.LastName) {
        updateInfo.lastName = this.EditedUser.LastName
        this.$store.state.User.LastName = this.EditedUser.LastName
      }

      if (this.$store.state.User.Email !== this.EditedUser.Email) {
        updateInfo.email = this.EditedUser.Email
        this.$store.state.User.Email = this.EditedUser.Email
      }

      // Send a request to the api to update the user's information
      this.$http.post(`/api/profile/${this.$store.state.User.Id}`, updateInfo)
      .then(response => {
        console.log(response)
        this.User = this.EditedUser
      }, response => {
        console.log(response)
      })
    }
  }
}

</script>
