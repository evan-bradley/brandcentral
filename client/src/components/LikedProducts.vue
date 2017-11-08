<template>
  <section class="section">
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
  </section>
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
        totalProducts: 0
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
        this.$http.get(`/api/user/likedproducts/${userId}?productsPer=${this.numberPerPage}&page=${page}`)
        .then(response => {
          if (response.data.success) {
            response.body.likedproducts.forEach(function (el) {
              var product = new Classes.Product(el.id, el.name, el.description, el.pictureUrl)
              newlikedProducts.push(product)
            }, this)
            this.likedProducts = newlikedProducts
            this.totalProducts = response.body.totalProducts
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
      }
    }
  }
</script>
