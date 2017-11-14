<template>
  <li class="channel-item" v-bind:class="{ 'is-active': channel.id == $route.params.channelId }">
    <router-link v-on:click.native="select()" class="item-link channel-item-link" :to="{ name: 'channel', params:{ channelId: channel.id } }">
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
    },
    methods: {
      select () {
        this.$parent.$emit('selectedChannel')
      }
    }
  }
</script>
