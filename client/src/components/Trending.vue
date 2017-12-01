<template>
  <div class="subscribed-channels-container">
    <div class="hero">
      <div class="hero-body">
        <div class="has-text-centered">
          <p class="title">
            Trending
          </p>
          <p class="subtitle">
            Discover products you never knew you needed.
          </p>
        </div>
      </div>
    </div>
    <div v-if="channels.length > 0">
      <div class="columns is-multiline">
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="channel in channels" :key="channel.id">
          <ChannelCard :channel="channel" />
        </div>
      </div>
    </div>
    <div v-else>
      <article class="message">
        <div class="message-body">
          There are no trending channels
        </div>
      </article>
    </div>
  </div>
</template>

<script>
  import ChannelCard from './ChannelCard.vue'
  export default {
    name: 'Trending',
    data () {
      return {
        channels: []
      }
    },
    components: {
      'ChannelCard': ChannelCard
    },
    created () {
      this.loadTrendingChannels()
    },
    methods: {
      loadTrendingChannels () {
        this.$http.get(`/api/channel/trending?limit=12&days_ago=30`)
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
