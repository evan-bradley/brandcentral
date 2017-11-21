<template>
  <div class="liked-products-container">
    <div class="control-container" style="margin-bottom:20px">
      <div class="field has-addons">
        <p class="control has-icons-left">
          <input class="input has-icon-left" type="text" placeholder="Search" v-model="searchText" @input="searchTextDidChange()">
          <span class="icon is-small is-left">
            <i class="material-icons">search</i>
          </span>
        </p>
      </div>
    </div>
    <div v-if="likedProducts.length > 0">
      <div class="columns is-multiline">
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="product in likedProducts" :key="product.name">
          <ProductItem :product="product" :displayMode="'small'"/>
        </div>
      </div>
      <nav class="pagination" v-show="totalProducts > numberPerPage" role="navigation" aria-label="pagination">
        <a class="pagination-previous" @click="previousPage()" :disabled="currentPage == 1">Previous</a>
        <a class="pagination-next" @click="nextPage()" :disabled="currentPage * numberPerPage >= totalProducts">Next page</a>
      </nav>
    </div>
    <div v-else>
      <article class="message">
        <div class="message-body">
          No products liked
        </div>
      </article>
    </div>
  </div>
</template>

<script>
  import EditProfile from './EditProfile'
  import ProductItem from './ProductItem.vue'
  var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
  var md5 = require('md5')

  export default {
    name: 'LikedProducts',
    props: {
      userId: {
        required: true
      }
    },
    data () {
      return {
        likedProducts: [],
        currentPage: 1,
        numberPerPage: 12,
        totalProducts: 0,
        searchText: ''
      }
    },
    watch: {
      userId: function (newVal, oldVal) {
        this.loadLikedProducts(1)
      }
    },
    components: {
      'EditProfile': EditProfile,
      'ProductItem': ProductItem
    },
    created () {
      this.loadLikedProducts(1)
    },
    methods: {
      hash (str) {
        return md5(str)
      },
      loadLikedProducts (page) {
        // if (page === this.currentPage) return
        var userId = this.$route.params.userId
        this.currentPage = page
        var newlikedProducts = []
        var request = `/api/user/likedproducts/${userId}?productsPer=${this.numberPerPage}&page=${page}`
        if (this.searchText !== '') {
          request = request + `&query=${this.searchText}`
        }
        this.$http.get(request)
        .then(response => {
          if (response.data.success) {
            response.body.products.forEach(function (el) {
              var product = new Classes.Product(el.id, el.name, el.description, el.pictureUrl, el.productUrl)
              newlikedProducts.push(product)
            }, this)
            this.likedProducts = newlikedProducts
            this.totalProducts = response.body.total
          }
        }, response => {
          console.log(`Failed to load products. userId=${userId}, page=${page}, numPerPage=${this.numPerPage}`)
        })
      },
      previousPage () {
        this.loadLikedProducts(this.currentPage - 1)
      },
      nextPage () {
        this.loadLikedProducts(this.currentPage + 1)
      },
      searchTextDidChange () {
        this.loadLikedProducts(1)
      }
    }
  }
</script>
