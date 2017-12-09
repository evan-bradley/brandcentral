<template>
    <div>    
        <div class="columns is-multiline" v-show="currentChannel === null">
            <div v-for="channel in userChannels" :key="channel.id" class="column is-2">
                <button class="button is-primary" @click="currentChannel = channel">{{ channel.name }}</button>
            </div>
        </div>
    <div v-if="currentChannel">
      <div class="columns is-multiline">
        <div class="column is-12">
          <button class="button is-primary" @click="currentChannel = null">Back to channel select</button>
        </div>
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="product in likedProducts" :key="product.id">
          <div>
            <h3 class="title is-4"> {{ product.name }} </h3>
            <img :src="product.pictureUrl" alt="Placeholder image">
            <button class="button is-primary" @click="RemoveFromChannel(product)">Remove from channel</button>
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
  components: {
    ProductItem: ProductItem
  },
  watch: {
    currentChannel (channel) {
      if (channel) {
        this.loadLikedProducts(channel)
      }
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    loadChannels () {
      this.$http(`/api/user/${this.$store.state.User.Id}/channels`).then(
        response => {
          if (response.data.success) {
            response.body.products.forEach(function (el) {
              this.userChannels.push(el)
            }, this)
          }
        }
      )
    },
    loadLikedProducts (page) {
      // if (page === this.currentPage) return
      var userId = this.$store.state.User.Id
      this.currentPage = page
      var newlikedProducts = []
      var url = `/api/channel/products/${this.currentChannel.Id}?productsPer=${this.numberPerPage}&page=${page}`

      this.$http.get(url).then(
        response => {
          if (response.data.success) {
            response.body.products.forEach(function (el) {
              newlikedProducts.push(el)
            }, this)
            this.likedProducts = newlikedProducts
            this.totalProducts = response.body.total
          }
        },
        response => {
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
      var payload = {
        tagid: product.tagid
      }
      this.$http.post(`/api/tag/delete/${product.id}`, payload)
      this.loadLikedProducts(this.currentChannel)
    }
  }
}
</script>
