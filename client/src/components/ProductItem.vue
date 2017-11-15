<template>
  <div class="voting-item" v-if="displayProduct">
    <!-- Large Display Mode (Component) -->
    <div v-if="displayMode === 'large'" class="large">
      <div class="field has-addons">
        <p class="control">
          <a class="button" v-on:click="back" style="border-radius: 100px;">
            <span class="icon">
              <i class="fa fa-angle-left"></i>
            </span>
            <span>Back</span>
          </a>
        </p>
      </div>
      <div class="columns" style="padding:10px">
        <div class="column is-4">
          <div class="image is-square" style="border: 1px solid #dedede;margin: -10px; overflow: hidden; border-radius: 5px;">
            <img :src="displayProduct.pictureUrl" alt="Placeholder image" style="object-fit: contain;">
            <div class="hover-content">
            <div class="voting-button-container">
              <div class="has-text-centered">
                <div class="field has-addons is-grouped is-grouped-centered">
                  <p class="control">
                    <a class="button is-large" v-bind:class="{ 'is-primary': this.disliked }" v-on:click.stop.prevent="dislike" style="border-radius: 100px;"><span class="icon is-small">
                        <i class="fa fa-thumbs-o-down"></i>
                      </span>
                    </a>
                  </p>
                  <p class="control">
                    <a class="button is-large" v-bind:class="{ 'is-primary': this.liked }" v-on:click.stop.prevent="like" style="border-radius: 100px;"><span class="icon is-small">
                        <i class="fa fa-thumbs-o-up"></i>
                      </span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        <div class="column is-8" style="padding-top: 0px">
          <div class="media">
            <div class="media-content">
              <div class="title is-4">
                <p class="has-text-left is-pulled-left">
                  {{ displayProduct.name}}
                </p>
              </div>
              <p class="has-text-left is-pulled-left">
                {{ displayProduct.description}}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Medium Display Mode (Channel) -->
    <div v-if="displayMode === 'medium'" class="medium">
      <router-link :to="{ name: 'product', params:{ productId: this.displayProduct.id, channel: this.channel } }">
        <div class="columns box" style="margin: 0px;">
          <div class="column is-4">
            <div class="image-container image is-square" style="margin: -10px; overflow: hidden; border-radius: 5px;">
              <img :src="displayProduct.pictureUrl" alt="Placeholder image" style="object-fit: contain;">
            </div>
          </div>
          <br>
          <div class="column is-8">
            <div class="media">
              <div class="media-content">
                <div class="title is-4">
                  <p class="title has-text-left is-pulled-left">
                    {{ displayProduct.name.substring(0, 80) + '...' }}
                  </p>
                </div>
                <p class="description has-text-left is-pulled-left">
                  {{ displayProduct.description.substring(0, 200) + '...'}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </router-link>
      <br>
      <div class="voting-button-container" style="margin-top: 20px">
          <div class="has-text-centered">
            <div class="field has-addons is-grouped is-grouped-centered">
              <p class="control">
                <a class="button is-medium" v-on:click.stop.prevent="previous" style="border-radius: 100px;">
                  <span class="icon is-small">
                    <i class="material-icons md-24">chevron_left</i>
                  </span>
                </a>
              </p>
              <p class="control">
                <a class="button is-medium" v-bind:class="{ 'is-primary': this.disliked }" v-on:click.stop.prevent="dislike" style="border-radius: 100px;">
                  <span class="icon is-small">
                    <i class="material-icons md-24">thumb_down</i>
                  </span>
                </a>
              </p>
              <p class="control">
                <a class="button is-medium" v-bind:class="{ 'is-primary': this.liked }" v-on:click.stop.prevent="like" style="border-radius: 100px;">
                  <span class="icon is-small">
                    <i class="material-icons md-24">thumb_up</i>
                  </span>
                </a>
              </p>
              <p class="control">
                <a class="button is-medium" v-on:click.stop.prevent="next" style="border-radius: 100px;">
                  <span class="icon is-small">
                    <i class="material-icons md-24">chevron_right</i>
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
    </div>

    <!-- Small Display Mode (Like Page)-->
    <div v-if="displayMode === 'small'" class="small">
      <router-link :to="{ name: 'product', params:{ productId: this.displayProduct.id, channel: this.channel } }">
        <div class="box">
          <div class="image is-square" style="margin: -10px; overflow: hidden; border-radius: 5px;">
            <img :src="displayProduct.pictureUrl" alt="Placeholder image" style="object-fit: contain;">
          </div>
          <hr style="margin: 20px -20px">
          <b><p style="font-size: 1em;line-height: 1em;height: 2em;overflow: hidden;">{{ displayProduct.name }}</p></b>
          <div class="voting-button-container" style="margin-top: 15px;">
            <div class="has-text-centered">
              <div class="field has-addons is-grouped">
                <p class="control">
                  <a class="button" v-bind:class="{ 'is-primary': this.disliked }" v-on:click.stop.prevent="dislike" style="border-radius: 100px;"><span class="icon is-small">
                      <i class="material-icons md-16">thumb_down</i>
                    </span>
                  </a>
                </p>
                <p class="control">
                  <a class="button" v-bind:class="{ 'is-primary': this.liked }" v-on:click.stop.prevent="like" style="border-radius: 100px;"><span class="icon is-small">
                      <i class="material-icons md-16">thumb_up</i>
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>



<script>
var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
export default {
  props: {
    productId: {
      required: false
    },
    product: {
      required: false
    },
    channel: {
      required: false,
      default: 0
    },
    displayMode: {
      required: false,
      default: 'large'
    }
  },
  data () {
    return {
      displayProduct: this.product,
      user: this.$store.state.User,
      liked: false,
      disliked: false
    }
  },
  watch: {
    product (product) {
      this.displayProduct = product
      this.refreshPreference()
    },
    productId (productId) {
      this.loadProductFromId(productId)
      this.refreshPreference()
    }
  },
  created () {
    if (this.productId) this.loadProductFromId(this.productId)
    this.refreshPreference()
  },
  methods: {
    previous () {
      this.$parent.$emit('previousProduct')
    },
    next () {
      this.$parent.$emit('nextProduct')
    },
    like () {
      var body = {
        channelId: this.channel
      }
      this.$http.post(`/api/product/like/${this.displayProduct.id}`, body)
        .then(response => { // Success
          if (response.data.success) {
            this.$parent.$emit('likedProduct', this.displayProduct)
            this.liked = true
            this.disliked = false
          }
        }, response => { // Error
          console.log(response)
          this.failureMessage = response.data.message
        })
    },
    dislike () {
      this.$http.post(`/api/product/dislike/${this.displayProduct.id}`)
        .then(response => { // Success
          if (response.data.success) {
            this.$parent.$emit('dislikedProduct', this.displayProduct)
            this.liked = false
            this.disliked = true
          }
        }, response => { // Error
          console.log(response)
          this.failureMessage = response.data.message
        })
    },
    loadProductFromId (productId) {
      this.$http.get(`/api/product/${productId}`)
        .then(response => { // Success
          if (response.data.success) {
            this.displayProduct = new Classes.Product(
              response.data.product.id,
              response.data.product.name,
              response.data.product.description,
              response.data.product.pictureUrl)
          }
        }, response => { // Error
          console.log(response)
          this.failureMessage = response.data.message
        })
    },
    back () {
      this.$router.go(-1)
    },
    refreshPreference () {
      this.$http.get(`/api/product/${this.displayProduct.id}/preference/${this.user.Id}`)
        .then(response => { // Success
          if (response.data.success) {
            this.liked = response.data.preference === 'like'
            this.disliked = response.data.preference === 'dislike'
          }
        }, response => { // Error
          console.log(response)
          this.failureMessage = response.data.message
        })
    }
  }
}
</script>
