<template>
  <router-link v-on:click.native="select()" 
    class="channel-row hover-container item-link channel-row-link" 
    v-bind:class="{ 'is-active': channel.id == $route.params.channelId }" 
    :to="{ name: 'channel', params:{ channelId: channel.id } }">
    <span class="tag">
      <i class="material-icons md-16">local_offer</i>
    </span>
    <span class="channel-name">{{ channel.name }}</span>
    <div class="hover-content right">
      <p v-if="subscribed()" class="control display-on-hover">
        <a class="button like-button" v-on:click.stop.prevent="unsubscribe">
          <span class="icon is-small">
            <i class="material-icons md-16">close</i>
          </span>
        </a>
      </p>
      <p v-else class="control">
        <a class="button like-button" v-on:click.stop.prevent="subscribe">
          <span class="icon is-small">
            <i class="material-icons md-16">add</i>
          </span>
        </a>
      </p>
    </div>
  </router-link>
</template>

<script>
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
      subscribed () {
        // Returns a boolean indicating if the user is subscribed to the current channel
        var channelId = this.channel.id
        var channels = this.$store.state.channels
        var subbed = channels.some(function (element) {
          return element.id === channelId
        })
        return subbed
      },
      subscribe () {
        this.$http.post(`/api/channels/subscribe/${this.channel.id}`)
        .then(response => {
          if (response.data.success) {
            this.$store.commit('addChannel', this.channel)
          }
        }, response => {
          console.log('Failed to subscribe')
        })
      },
      unsubscribe () {
        this.$http.post(`/api/channels/unsubscribe/${this.channel.id}`)
        .then(response => {
          if (response.data.success) {
            this.$store.commit('removeChannel', this.channel.id)
          }
        }, response => {
          console.log('Failed to unsubscribe')
        })
      }
    }
  }
</script>
