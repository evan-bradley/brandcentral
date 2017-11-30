<template>
  <li class="channel-row"
    style="padding: 0px; border-radius: 4px; overflow: hidden; background-color: #EC2841;">
    <router-link
      style="height:120px;display: flex; justify-content: center;align-items: center; background-position: center;"
      v-bind:style="{ backgroundImage: getHashImageUrl() }" 
      v-bind:class="{ 'is-active': channel.id == $route.params.channelId }" 
      v-on:click.native="select()" 
      class="item-link channel-row-link" 
      :to="{ name: 'channel', params:{ channelId: channel.id } }">
      <span class="channel-name"
        style="color: white; font-weight: bold;">{{ channel.name }}
      </span>
    </router-link>
  </li>
</template>

<script>
  var GeoPattern = require('geopattern')
  export default {
    name: 'ChannelRow',
    props: {
      channel: {
        type: Object,
        required: true
      }
    },
    methods: {
      select () {
        this.$parent.$emit('selectedChannel')
      },
      getHashImageUrl () {
        var pattern = GeoPattern.generate(this.channel.name, {color: '#EC2841'})
        return pattern.toDataUrl()
      }
    }
  }
</script>
