<template>
    <div class="columns is-multiline is-centered">
        <div class="column is-12">
          <span style="font-size: 1.4rem; color: black;">{{ this.channel.name }}</span>
        </div>
        <div class="column is-12">
           <voting-item :item ="this.currentItem" :channel="this.channel.id" />
        </div>
    </div>
</template>

<script>
  import VotingItem from './VotingItem.vue'
  var axios = require('axios')
  var instance = axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/https://brandcentral.xyz',
    timeout: 1000,
  })

  export default {
    props: ['channelId'],
    data () {
      return {
        currentItem: undefined,
        channels: [],
        channel: {}
      }
    },
    watch: {
      channelId: function (newVal, oldVal) {
        this.loadChannelInformation()
      }
    },
    components: {
      'voting-item': VotingItem
    },
    created () {
      this.loadChannelInformation()
    },
    methods: {
      loadChannelInformation () {
        var channelId = this.channelId
        instance.get(`/api/channels/${channelId}`)
        .then(response => {
          if (response.data.success) {
            this.channel = response.data.channel
          }
        }, response => {
          console.log('Failed to load channel information')
        })
      }
    }
  }
</script>
