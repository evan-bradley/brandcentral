<template>
  <li class="user-item" v-bind:class="{ 'is-active': user.id == $route.params.userId }">
    <router-link v-on:click.native="select()" class="item-link user-item-link" :to="{ name: 'profile', params:{ userId: user.id } }">
      <img class="profile-image" v-bind:src="`https://secure.gravatar.com/avatar/${user.emailHash}?s=32&d=identicon`" />
      <div class="information-container">
        <span class="name" v-if="this.shouldDisplayName">{{ user.firstName }} {{ user.lastName}}</span>
        <span class="username">{{ user.username }}</span>
      </div>
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
      },
      shouldDisplayName: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    methods: {
      select () {
        this.$parent.$emit('selectedUser')
      }
    }
  }
</script>
