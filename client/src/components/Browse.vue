<template>
  <section class="section">
    <div class="columns">
      <div class="column is-narrow">
        <aside class="menu box" style="width: 250px;">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Search" v-model="searchText">
            </div>
          </div>
          <hr style="margin-right: -20px; margin-left: -20px;">
          <div v-show="searchText.length > 0">
            No results found
            <hr style="margin-right: -20px; margin-left: -20px;">
          </div>
          <p v-show="channels.length > 0" class="menu-label">Channels</p>
          <ul class="menu-list">
            <li v-for="channel in channels" :key="channel.id">
              <router-link v-bind:class="{ 'is-active': channel.id == $route.params.channel }" :to="{ name: 'Channel', params:{ channel: channel.id } }">
                <i class="fa fa-tag" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true"></i>
                {{ channel.name }}
              </router-link>
            </li>
          </ul>
          <p v-show="users.length > 0" class="menu-label">Users</p>
          <ul class="menu-list">
            <li v-for="user in users" :key="user.id">
              <router-link v-bind:class="{ 'is-active': user.id == $route.params.user }" :to="{ name: 'BrowseProfile', params:{ user: user.id } }">
                <i class="fa fa-user" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true"></i>
                {{ user.username }}
              </router-link>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        user: this.$store.state.User,
        searchText: '',
        channels: [],
        users: [{
          id: 13,
          username: 'jpherkness'
        }]
      }
    },
    created () {
      this.loadChannels()
    },
    methods: {
      loadChannels () {
        this.$http.get(`/api/channels/${this.user.Id}`)
          .then(response => {
            if (response.data.success) {
              this.channels = response.data.channels
            }
          }, response => {
            // Could not get any channels
          })
      }
    }
  }
</script>
