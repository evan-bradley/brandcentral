<template>
    <div class="channel-container columns is-multiline is-centered">
        <div class="column is-12">
          <span class="is-pulled-left" style="font-size: 1.4rem; color: black;">{{ this.channel.name }}</span>
          <span v-if="subscribed()" class="is-pulled-right">
            <a class="button is-primary"  @click="unsubscribe()">
              Unsubscribe
            </a>
          </span>
          <span v-else class="is-pulled-right">
            <a class="button" @click="subscribe()">
              Subscribe
            </a>
          </span>
          <br>
          <hr class="divider">
        </div>
        <div class="product-container column is-9">
           <ProductItem v-if="this.displayProduct" :item ="this.displayProduct" :channel="this.channel.id" :product="this.displayProduct" :displayMode="'medium'"/>
        </div>
    </div>
</template>

<script>
  import ProductItem from './ProductItem.vue'
  var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
  export default {
    props: ['channelId'],
    data () {
      return {
        channels: this.$store.state.channels,
        channel: {},
        displayProduct: undefined,
        previousProducts: [],
        maxPrevious: 5
      }
    },
    watch: {
      channelId: function (newVal, oldVal) {
        this.loadChannelInformation()
        this.next()
        this.previousProducts = []
      }
    },
    components: {
      'ProductItem': ProductItem
    },
    created () {
      this.loadChannelInformation()

      // Register event handlers
      this.$on('likedProduct', event => {
        console.log('LIKED')
        setTimeout(this.next, 250)
      })

      this.$on('dislikedProduct', event => {
        console.log('DISLIKED')
        setTimeout(this.next, 250)
      })

      this.$on('nextProduct', event => {
        console.log('NEXT')
        this.next()
      })

      this.$on('previousProduct', event => {
        console.log('PREVIOUS')
        this.previous()
      })
    },
    mounted () {
      this.next()
    },
    methods: {
      loadChannelInformation () {
        var channelId = this.$route.params.channelId
        this.$http.get(`/api/channels/${channelId}`)
        .then(response => {
          if (response.data.success) {
            this.channel = response.body.channel
          }
        }, response => {
          console.log('Failed to load channel information')
        })
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
      },
      previous () {
        if (this.previousProducts.length > 0) {
          this.displayProduct = this.previousProducts.pop()
        }
      },
      next () {
        if (typeof this.displayProduct !== 'undefined') {
          this.previousProducts.push(this.displayProduct)
          if (this.previousProducts.length > this.maxPrevious) {
            this.previousProducts.shift()
          }
        }
        this.$http.get(`/api/product/predicted/${this.channelId}`)
          .then(response => { // Success
            if (response.data.success) {
              var id = response.data.product.id
              var name = response.data.product.name
              var description = response.data.product.description
              var pictureUrl = response.data.product.pictureUrl
              this.displayProduct = new Classes.Product(id, name, description, pictureUrl)
            } else {
              this.failureMessage = response.data.message
            }
          }, response => { // Error
            console.log(response)
            this.failureMessage = response.data.message
          })
      }
    }
  }
</script>
