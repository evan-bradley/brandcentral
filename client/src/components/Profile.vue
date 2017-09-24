<template>
  <div class="column is-8 is-offset-2">
    <div class="column is-12">
      <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(User.Email) + '?s=46&d=identicon'" class="profile-image" />
      <h1 class="title">{{ User.FirstName }} {{ User.LastName }}</h1>
      <h1 class="subtitle">@{{ User.UserName }}</h1>
      <router-link class="button" :to="{ name: 'EditProfile' }">Edit</router-link>
    </div>
  </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var md5 = require('md5');
import EditProfile from './EditProfile'

export default {
  name: 'Profile',
  data() {
    return {
      User: this.$store.state.User
    }
  },
  components: {
    'EditProfile': EditProfile
  },
  methods: {
    hash(str) {
      return md5(str)
    }
  }
}
</script>
