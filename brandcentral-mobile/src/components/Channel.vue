<template>
  <div>
      <div class="columns is-multiline is-centered" v-show="channelId">
          <div class="column is-12 columns is-mobile">
            <div class="column is-6">
              <span style="font-size: 1.4rem; color: black;">{{ this.channel.name }}</span>
            </div>
            <div class="column is-6">
              <button class="button is-primary" @click="channelId = null">Back to channel select</button>
            </div>
          </div>
          <div class="column is-12">
            <voting-item :item ="this.currentItem" :channel="this.channel.id" :userId="this.userId" />
          </div>
      </div>
      <div class="columns is-mobile is-multiline is-centered" v-show="!(channelId)">
        <div class="column is-6" v-for="item in channels" :key="item.id">
          <button class="button is-primary is-inverted channel-select-buttons subtitle" @click="channelId = item.id">
            <i class="fa fa-tag" style="opacity: 0.8; margin-right: 8px;" aria-hidden="true"></i> {{ item.name }}
            </button>
        </div>
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
    props: ['userId'],
    data () {
      return {
        currentItem: undefined,
        channelId: undefined,
        channels: [],
        channel: {}
      }
    },
    watch: {
      channelId: function (newVal, oldVal) {
        this.loadChannelInformation()
      },
      userId: function(){
        this.getAllChannelsForUser()
      }
    },
    components: {
      'voting-item': VotingItem
    },
    methods: {
      getAllChannelsForUser(){
        instance.get(`/api/user/${this.userId}/channels`)
        .then(response => {
          if (response.data.success) {
            for(var i = 0; i < response.data.channels.length; i++){
              if (response.data.channels[i].id !== 0) {
                this.channels.push(response.data.channels[i])
              }
            }
          }
        }, response => {
          console.log('Failed to load channel information')
        })
      },
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
