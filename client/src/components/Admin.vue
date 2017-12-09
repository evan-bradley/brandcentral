<template>
  <div>
    <!-- 
      After logging in replace the url with /admin it should bring you to this vue file.
      the first section pops up if there is no current channel. and allows you to select a channel
      the bottom half displays all the products and gives you a button to press to remove a products 
      tag. also added some logging to display post request responses.
    -->
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
                  <div class="columns is-multiline">
                      <div class="column is-12">
                          <h3 class="title is-4"> {{ product.name }} </h3>
                      </div>
                      <div class="column is-12">
                          <img :src="product.pictureUrl" alt="Placeholder image" class="column is-12">
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
          console.log(response)
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
          console.log(response)
          if (response.data.success) {
            response.body.products.forEach(function (el) {
              newlikedProducts.push(el)
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
      var payload = {
        tagid: product.tagid
      }
      this.$http.post(`/api/tag/delete/${product.id}`, payload)
      this.loadLikedProducts(this.currentChannel)
    }
  }
}
</script>
