<template>
    <router-link
      class="channel-card grow" 
      v-bind:style="{ backgroundImage: getHashImageUrl() }" 
      v-bind:class="{ 'is-active': channel.id == $route.params.channelId }" 
      v-on:click.native="select()" 
      :to="{ name: 'channel', params:{ channelId: channel.id } }">
      <span class="channel-label">
        {{ channel.name }}
      </span>
      <div class="hover-content">
        <span v-if="channel.number_of_likes" class="tag trending-label">
          <i class="trending-icon material-icons md-16">whatshot</i>
          <span>{{ channel.number_of_likes }}</span>
        </span>
      </div>
    </router-link>
</template>

<script>
  var GeoPattern = require('geopattern')
  export default {
    name: 'ChannelCard',
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
