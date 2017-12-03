<template>
  <div class="subscribed-channels-container">
    <div class="control-container" style="margin-bottom:20px">
      <div class="field has-addons has-addons-right">
        <p class="control">
          <a class="button" v-bind:class="{ 'is-dark': this.layout === 'grid' }" @click="displayGrid()">
            <i class="material-icons">view_module</i>
          </a>
        </p>
        <p class="control">
          <a class="button" v-bind:class="{ 'is-dark': this.layout === 'list' }" @click="displayList()">
            <i class="material-icons">view_list</i>
          </a>
        </p>
      </div>
    </div>
    <div v-if="channels.length > 0">
      <div v-if="layout === 'grid'" class="channels-grid">
        <div class="columns is-multiline">
          <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="channel in channels" :key="channel.id">
            <div class='box' style='padding:0px;overflow:hidden;'>
              <ChannelRow :channel="channel" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="layout === 'list'" class="channels-list">
        <hr style="margin:0px;">
        <div class="columns is-multiline" style="margin-top:0px;">
          <div class="column is-12" v-for="channel in channels" :key="channel.id" style="padding-top: 0px;padding-bottom:0px">
            <ChannelRow :channel="channel" />
              <hr style="margin:0px;">
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
    computed: { layout () { return this.$store.state.layout } },
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
      },
      displayList () {
        this.$store.commit('changeLayout', 'list')
      },
      displayGrid () {
        this.$store.commit('changeLayout', 'grid')
      }
    }
  }
</script>
