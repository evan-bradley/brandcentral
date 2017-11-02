<template>
  <li class="user-item" v-bind:class="{ 'is-active': user.id == $route.params.userId }">
    <router-link class="item-link user-item-link" :to="{ name: 'BrowseProfile', params:{ userId: user.id } }">
      <img class="profile-image" v-bind:src="`https://secure.gravatar.com/avatar/${user.emailHash}?s=32&d=identicon`" />
      <span class="username">{{ user.username }}</span>
    </router-link>
  </li>
</template>

<script>
  export default {
    name: 'UserItem',
    props: {
      user: {
        type: Object,
        required: true
      }
    }
  }
</script>
