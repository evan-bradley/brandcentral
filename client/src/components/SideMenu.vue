<template>
  <div class="side-menu">
    <div class="search-input-container">
      <input class="input" type="text" placeholder="Search" v-model="searchText" @input="refreshSearchResults()">
    </div>
    <hr>
    <div class="search-results-container" v-if="searchText.length > 0">
      <div class="search-results-message" v-if="searchedUsers.length == 0 && searchedChannels.length == 0">
        No Results
      </div>
      <p v-show="searchedChannels.length > 0" class="label">Channels</p>
      <ul class="search-results-channels">
        <ChannelRow v-for="channel in searchedChannels" :key="channel.id" :channel="channel"></ChannelRow>
      </ul>
      <p v-show="searchedUsers.length > 0" class="label">Users</p>
      <ul class="search-results-users">
        <UserRow v-for="user in searchedUsers" :key="user.id" :user="user"></UserRow>
      </ul>
      <hr>
    </div>
    <div class="information-container">
      <ul v-show="this.$store.state.channels.length > 0" class="subscribed-channels">
        <p class="label">Subscribed</p>
        <ChannelRow v-for="channel in this.$store.state.channels" :key="channel.id" :channel="channel"></ChannelRow>
      </ul>
      <ul v-show="this.$store.state.followedUsers.length > 0" class="followed-users">
        <p class="label">Following</p>
        <UserRow v-for="user in this.$store.state.followedUsers" :key="user.id" :user="user"></UserRow>
      </ul>
    </div>
  </div>
</template>


<script>
  import UserRow from './UserRow.vue'
  import ChannelRow from './ChannelRow.vue'
  export default {
    name: 'SideMenu',
    components: {
      'UserRow': UserRow,
      'ChannelRow': ChannelRow
    },
    data () {
      return {
        user: this.$store.state.User,
        searchText: '',
        channels: this.$store.state.channels,
        users: this.$store.state.followedUsers,
        searchedUsers: [],
        searchedChannels: []
      }
    },
    created () {
      this.loadChannels()
      this.loadUsers()

      this.$on(['selectedUser', 'selectedChannel'], event => {
        this.$parent.slideout.toggle()
      })
    },
    methods: {
      loadChannels () {
        this.$http.get(`/api/user/${this.user.Id}/channels`)
          .then(response => {
            if (response.data.success) {
              this.$store.commit('setChannels', response.data.channels)
            }
          }, response => {
            console.log(response.data.message)
          })
      },
      loadUsers () {
        this.$http.get(`/api/user/following/${this.user.Id}`)
          .then(response => {
            if (response.data.success) {
              this.$store.commit('setFollowedUsers', response.data.following)
            }
          }, response => {
            console.log(response.data.message)
          })
      },
      refreshSearchResults () {
        this.$http.get(`/api/search?query=${this.searchText}&limit=4`)
          .then(response => {
            if (response.data.success) {
              this.searchedUsers = response.data.results.users
              this.searchedChannels = response.data.results.channels
            }
          }, response => {
            console.log(response.data.message)
          })
      }
    }
  }
</script>
