<template>
    <div class="columns" style="margin: 15px;">
      <div class="column is-narrow">
        <aside class="menu box" style="width: 250px;">
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Search" v-model="searchText">
            </div>
          </div>
          <hr style="margin-right: -20px; margin-left: -20px;">
          <div v-show="searchText.length > 0">
            Here is where it would show the results of the search...
            <hr style="margin-right: -20px; margin-left: -20px;">
          </div>
          <p v-show="channels.length > 0" class="menu-label">Tags</p>
          <ul class="menu-list">
            <li v-for="channel in channels" :key="channel.id">
              <router-link v-bind:class="{ 'is-active': channel.id == $route.query.tag }" :to="{ name: 'Channel', query:{ tag: channel.id } }">
                <i class="fa fa-tag" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true"></i>
                {{ channel.description }}
              </router-link>
            </li>
          </ul>
          <p v-show="users.length > 0" class="menu-label">Users</p>
          <ul class="menu-list">
            <li v-for="user in users" :key="user.id">
              <router-link v-bind:class="{ 'is-active': user.id == $route.query.user }" :to="{ name: 'Channel', query:{ user: user.id } }">
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
</template>

<script>
  export default {
     data(){
            return {
              searchText: '',
              channels: [
                {
                  id: 0, 
                  description: 'General'
                }, 
                {
                  id: 1, 
                  description: 'Sports'
                }, 
                {
                  id: 2, 
                  description: 'Electronics'
                }
              ],
              users: [{id: 13, username: 'jpherkness'}],
            }
        }
  }
</script>
