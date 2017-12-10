<template>
  <div>
    <!--
      After logging in replace the url with /admin it should bring you to this vue file.
      the first section pops up if there is no current channel. and allows you to select a channel
      the bottom half displays all the products and gives you a button to press to remove a products
      tag. also added some logging to display post request responses.
    -->
    <br>
    <section class="section">
      <div class="columns is-multiline" v-show="currentChannel === null">
        <div class="container">
          <div class="columns is-mobile is-multiline">
            <div v-for="channel in userChannels" v-bind:key="channel.id" class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
              <a class="box" v-on:click="currentChannel = channel, loadLikedProducts(1)">
                <h3 class="title is-6">
                  <i class="material-icons md-16" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true">local_offer</i>
                  <span>{{ channel.CHANNEL_NAME }}</span>
                </h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
      <div v-if="currentChannel">
          <div class="columns is-multiline">
            <div class="column is-12"> Channel Name: {{ currentChannel.CHANNEL_NAME }} <br> Channel ID: {{ currentChannel.CHANNEL_ID }} <br> Number Of Products: {{ totalProducts }}</div>
              <div class="column is-12">
                <button class="button is-primary" @click="currentChannel = null">Back to channel select</button>
              </div>
              <div class="column is-12">
                <nav class="pagination" v-show="totalProducts > numberPerPage" role="navigation" aria-label="pagination">
                  <a class="pagination-previous" @click="previousPage()" :disabled="currentPage == 1">Previous</a>
                  <a class="pagination-next" @click="nextPage()" :disabled="currentPage * numberPerPage >= totalProducts">Next page</a>
                </nav>
              </div>
              <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="product in likedProducts" :key="product.id">
                <div class="box">
                  <div>
                    <div class="image-container image is-square">
                      <img :src="product.pictureUrl" alt="Placeholder image">
                    </div>

                    <div class="content has-text-left">
                      {{ product.name.substring(0, 80) + '...' }}
                    </div>
                  </div>
                  <div class="content has-text-left">
                    Product ID: {{ product.id }}
                  </div>
                  <div class="content has-text-left">
                    Channel ID: {{ product.channelid }}
                  </div>
                  <div class="content has-text-left">
                    Tag ID: {{ product.tagid }}
                  </div>
                <div class="column is-12">
                  <button class="button is-primary" @click="RemoveFromChannel(product)">Remove from channel</button>
                </div>
                </div>
              </div>
          </div>
          <nav class="pagination" v-show="totalProducts > numberPerPage" role="navigation" aria-label="pagination">
              <a class="pagination-previous" @click="previousPage()" :disabled="currentPage == 1">Previous</a>
              <a class="pagination-next" @click="nextPage()" :disabled="currentPage * numberPerPage >= totalProducts">Next page</a>
          </nav>
      </div>
  </div>
</template>

<script>
  import ProductItem from './ProductItem.vue'
  var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
  export default {
    name: 'Admin',
    data () {
      return {
        currentChannel: null,
        userChannels: [],
        likedProducts: [],
        currentPage: 1,
        numberPerPage: 20,
        totalProducts: 0,
        searchText: ''
      }
    },
    watch: {
      currentChannel (channel) {
        if (channel === null) {
          this.loadLikedProducts(1)
        }
      }
    },
    components: {
      'ProductItem': ProductItem
    },
    created () {
      this.loadChannels()
    },
    methods: {
      loadChannels () {
        this.$http.get('/api/channels/onboard')
          .then(response => {
            console.log(response.data.channels)
            if (response.data.success) {
              response.data.channels.forEach(function (el) {
                this.userChannels.push(el)
              }, this)
            }
          },
          response => {
            console.log(response.data.channels)
            console.log('Failed')
          }
        )
      },
      loadLikedProducts (page) {
        // if (page === this.currentPage) return
        var userId = this.$store.state.User.Id
        this.currentPage = page
        var newlikedProducts = []
        var url = `/api/channel/products/${this.currentChannel.CHANNEL_ID}?productsPer=${this.numberPerPage}&page=${page}`
        this.$http.get(url)
          .then(response => {
            if (response.data.success) {
              response.body.products.forEach(function (el) {
                var product = new Classes.ChannelProduct(el.id, el.name, el.description, el.pictureUrl, el.productUrl, el.channelid, el.tagid)
                newlikedProducts.push(product)
              }, this)
              this.likedProducts = newlikedProducts
              this.totalProducts = response.body.total
            }
          },
          response => {
            console.log(response)
            console.log(`Failed to load products. userId=${userId}, page=${page}, numPerPage=${this.numPerPage}`)
          }
        )
      },
      previousPage () {
        this.loadLikedProducts(this.currentPage - 1)
      },
      nextPage () {
        this.loadLikedProducts(this.currentPage + 1)
      },
      RemoveFromChannel (product) {
        var body = {
          tagid: product.tagid
        }
        this.$http.post(`/api/tag/delete/${product.id}`, body)
        this.loadLikedProducts(this.currentPage)
      }
    }
  }
</script>
