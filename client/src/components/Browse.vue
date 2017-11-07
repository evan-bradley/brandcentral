<template>
  <section class="section">
    <div class="columns">
      <div class="column is-narrow is-hidden-touch">
        <SideMenu class="aside"></SideMenu>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<script>
  import SideMenu from './SideMenu.vue'
  export default {
    components: {
      'SideMenu': SideMenu
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
    },
    methods: {
      loadChannels () {
        this.$http.get(`/api/user/${this.user.Id}/channels`)
          .then(response => {
            if (response.data.success) {
              this.$store.commit('setChannels', response.data.channels)
            }
          }, response => {
            // Could not get any channels
          })
      },
      loadUsers () {
        this.$http.get(`/api/user/following/${this.user.Id}`)
          .then(response => {
            if (response.data.success) {
              this.$store.commit('setFollowedUsers', response.data.following)
            }
          }, response => {
            // Could not get any channels
          })
      },
      refreshSearchResults () {
        this.$http.get(`/api/users/search?query=${this.searchText}&limit=4`)
          .then(response => {
            if (response.data.success) {
              this.searchedUsers = response.data.users
            }
          }, response => {
            // Could not get any channels
          })

        this.$http.get(`/api/channel/search?query=${this.searchText}&limit=4`)
          .then(response => {
            if (response.data.success) {
              this.searchedChannels = response.data.channels
            }
          }, response => {
            // Could not get any channels
          })
      }
    }
  }
</script>
