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
    <tabs>
      <tab name="Channels">
        <div v-if="channels.length > 0">
          <div class="columns is-multiline">
            <div class="column is-one-quarter is-half-tablet is-12-mobile"
              v-for="channel in channels" :key="channel.id">
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
      </tab>
      <tab name="Products">
        <div v-if="products.length > 0">
          <div class="columns is-multiline">
            <div class="column is-one-quarter is-half-tablet is-12-mobile"
              v-for="product in products" :key="product.id">
              <ProductItem :productId="product.id" :displayMode="'small'" />
            </div>
          </div>
        </div>
        <div v-else>
          <article class="message">
            <div class="message-body">
              There are no trending products
            </div>
          </article>
        </div>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import ChannelCard from './ChannelCard.vue'
  import ProductItem from './ProductItem.vue'
  import Tab from './Tab.vue'
  import Tabs from './Tabs.vue'
  export default {
    name: 'Trending',
    data () {
      return {
        channels: [],
        products: []
      }
    },
    components: {
      'ChannelCard': ChannelCard,
      'ProductItem': ProductItem,
      'tabs': Tabs,
      'tab': Tab
    },
    created () {
      this.loadTrendingChannels()
      this.loadTrendingProducts()
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
      },
      loadTrendingProducts () {
        this.$http.get(`/api/products/trending?limit=12&days_ago=30`)
          .then(response => {
            if (response.data.success) {
              this.products = response.data.products
            }
          }, response => {
            // Could not get any channels
          })
      }
    }
  }
</script>
