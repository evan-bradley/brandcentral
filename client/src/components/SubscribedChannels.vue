<template>
  <div class="subscribed-channels-container">
    <div v-if="channels.length > 0">
      <div class="columns is-multiline">
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="channel in channels" :key="channel.id">
          <div class='box' style='padding:0px;overflow:hidden;'>
            <ChannelRow :channel="channel" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <article class="message">
        <div class="message-body">
          This user is not following any channels
        </div>
      </article>
    </div>
  </div>
</template>

<script>
  import EditProfile from './EditProfile'
  import ProductItem from './ProductItem.vue'
  import ChannelRow from './ChannelRow.vue'
  export default {
    name: 'SubscribedChannels',
    props: {
      userId: {
        required: true
      }
    },
    data () {
      return {
        channels: []
      }
    },
    watch: {
      userId: function (newVal, oldVal) {
        this.loadChannels()
      }
    },
    components: {
      'EditProfile': EditProfile,
      'ProductItem': ProductItem,
      'ChannelRow': ChannelRow
    },
    created () {
      this.loadChannels()
    },
    methods: {
      loadChannels () {
        var userId = this.$route.params.userId
        this.$http.get(`/api/user/${userId}/channels`)
          .then(response => {
            console.log(response.data)
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
