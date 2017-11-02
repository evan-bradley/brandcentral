<template>
  <section class="section">
    <div class="columns">
      <div class="column is-narrow">
        <aside class="box side-bar" style="width: 250px;">
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
              <li v-for="channel in searchedChannels" :key="channel.id" class="channel-item">
                <router-link class="item-link channel-item-link" :to="{ name: 'Channel', params:{ channelId: channel.id } }">
                  <span class="tag">
                    <i class="fa fa-tag" aria-hidden="true"></i>
                  </span>
                  <span class="channel-name">
                    {{ channel.name }}
                  </span>
                </router-link>
              </li>
            </ul>
            <p v-show="searchedUsers.length > 0" class="label">Users</p>
            <ul class="search-results-users">
              <li v-for="user in searchedUsers" :key="user.id" class="user-item">
                <router-link class="item-link user-item-link" :to="{ name: 'BrowseProfile', params:{ userId: user.id } }">
                  <img class="profile-image" v-bind:src="`https://secure.gravatar.com/avatar/${user.emailHash}?s=32&d=identicon`"/>
                  <span class="username">{{ user.username }}</span>
                </router-link>
              </li>
            </ul>
            <hr>
          </div>
          <div class="information-container">
            <p v-show="this.$store.state.channels.length > 0" class="label">Subscribed</p>
            <!-- <ul class="menu-list">
              <li v-for="channel in this.$store.state.channels" :key="channel.id">
                <router-link v-bind:class="{ 'is-active': channel.id == $route.params.channelId }" :to="{ name: 'Channel', params:{ channelId: channel.id } }">
                  <i class="fa fa-tag" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true"></i>
                  {{ channel.name }}
                </router-link>
              </li>
            </ul> -->
            <ul class="subscribed-channels">
              <li v-for="channel in this.$store.state.channels" :key="channel.id" class="channel-item">
                <router-link class="item-link channel-item-link" :to="{ name: 'Channel', params:{ channelId: channel.id } }">
                  <span class="tag">
                    <i class="fa fa-tag" aria-hidden="true"></i>
                  </span>
                  <span class="channel-name">
                    {{ channel.name }}
                  </span>
                </router-link>
              </li>
            </ul>
            <p v-show="this.$store.state.followedUsers.length > 0" class="label">Following</p>
            <!-- <ul class="menu-list">
              <li v-for="user in this.$store.state.followedUsers" :key="user.id">
                <router-link v-bind:class="{ 'is-active': user.id == $route.params.userId }" :to="{ name: 'BrowseProfile', params:{ userId: user.id } }">
                  <i class="fa fa-user" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true"></i>
                  {{ user.username }}
                </router-link>
              </li>
            </ul> -->
            <ul class="folowed-users">
              <li v-for="user in this.$store.state.followedUsers" :key="user.id" class="user-item">
                <router-link class="item-link user-item-link" :to="{ name: 'BrowseProfile', params:{ userId: user.id } }">
                  <img class="profile-image" v-bind:src="`https://secure.gravatar.com/avatar/${user.emailHash}?s=32&d=identicon`"/>
                  <span class="username">{{ user.username }}</span>
                </router-link>
              </li>
            </ul>
          </div>
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
