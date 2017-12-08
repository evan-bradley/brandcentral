<template>
  <div style="">
      <div class="columns is-multiline is-centered" v-show="channelId">
        <div class="column is-12">
          <voting-item :item ="this.currentItem" :channel="this.channel.id" :userId="this.userId" />
        </div>
      </div>
      <div class="columns is-mobile is-multiline" v-show="!(channelId)">
        <div class="column is-12">
          <h1 class="title is-4 is-centered">Your Channels</h1>
        </div>
        <div class="column is-12">
          <li class="channel-row" @click="selectChannel(item)"  v-for="item in channels" :key="item.id">
            <div class="channel-row-element">
            <!-- <button class="button is-primary is-outlined" @click="selectChannel(item)"> -->
              <span class="tag">
                <i class="fa fa-tag" aria-hidden="true"></i>
                <!-- <i class="material-icons md-16">local_offer</i> -->
              </span>
              <span class="channel-name">{{ item.name }}</span>
               <a class="button is-small is-pulled-right" style="border-radius: 100px;">
              <span class="icon is-small">
                <i class="material-icons md-24">chevron_right</i>
              </span>
            </a>
            <!-- </button> -->
            </div>
          </li>
          <!-- <button class="button is-primary is-inverted channel-select-buttons subtitle" >
            <i class="fa fa-tag" style="opacity: 0.8; margin-right: 8px;" aria-hidden="true"></i> {{ item.name }}
            </button> -->
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
    props: ['userId','showChannelSelect'],
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
      },
      showChannelSelect: function () {
        this.showChannelReset()
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
            this.$emit('changeChannel', response.data.channel.name)
          }
        }, response => {
          console.log('Failed to load channel information')
        })
      },
      showChannelReset () {
        console.log(this.channelId)
        if (this.showChannelSelect === true) {
          this.$emit('setChannelName', "") 
          this.channelId = null
        }
      },
      selectChannel (item) {
        this.channelId = item.id 
        this.$emit('selectedChannel')
      }
    }
  }
</script>
