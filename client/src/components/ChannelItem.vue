<template>
  <li class="channel-item" v-bind:class="{ 'is-active': channel.id == $route.params.channelId }">
    <router-link class="item-link channel-item-link" :to="{ name: 'Channel', params:{ channelId: channel.id } }">
      <span class="tag">
        <i class="fa fa-tag" aria-hidden="true"></i>
      </span>
      <span class="channel-name">{{ channel.name }}</span>
    </router-link>
  </li>
</template>

<script>
  export default {
    name: 'ChannelItem',
    props: {
      channel: {
        type: Object,
        required: true
      }
    }
  }
</script>
