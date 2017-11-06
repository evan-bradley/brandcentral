<template>
  <div v-if="mutableProduct" class="voting-item" v-bind:class="{ 'small': this.displayMode }">
    <div class="box">
      <figure class="image is-square" style="margin: -10px; overflow: hidden; border-radius: 5px;">
        <img :src="mutableProduct.pictureUrl" alt="Placeholder image">
      </figure>
      <hr style="margin: 20px -20px">
      <div class="media">
        <div class="media-content">
          <div :class="[this.displayMode ? 'subtitle is-5':'title is-4']">
            <p class="has-text-left is-pulled-left">
              {{ mutableProduct.name.substr(0, 50) + '...' }}
            </p>
          </div>
        </div>
      </div>
      <div class="content has-text-left" v-show="!this.displayMode">
        {{ mutableProduct.description.substring(0, 80) + '...'  }}
      </div>
    </div>
    <div v-show="!this.displayMode">
      <div class="has-text-centered">
        <div class="field has-addons is-grouped is-grouped-centered">
          <p class="control">
            <a class="button" v-on:click="previous" style="border-radius: 100px;">
              <span class="icon is-small">
                <i class="fa fa-angle-left"></i>
              </span>
              <span>Prev</span>
            </a>
          </p>
          <p class="control" style="margin-right: -1px;">
            <a class="button" v-on:click="dislike" style="border-bottom-left-radius: 100px; border-top-left-radius: 100px;">
              <span class="icon is-small">
                <i class="fa fa-thumbs-o-down"></i>
              </span>
              <span>Dislike</span>
            </a>
          </p>
          <p class="control">
            <a class="button" v-on:click="like" style="border-bottom-right-radius: 100px; border-top-right-radius: 100px;">
              <span class="icon is-small">
                <i class="fa fa-thumbs-o-up"></i>
              </span>
              <span>Like</span>
            </a>
          </p>
          <p class="control">
            <a class="button" v-on:click="next" style="border-radius: 100px;">
              <span>Next</span>
              <span class="icon is-small">
                <i class="fa fa-angle-right"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
  export default {
    props: ['product', 'channel', 'displayMode'],
    data () {
      return {
        mutableProduct: this.product
      }
    },
    watch: {
      channel () {
        this.next()
      }
    },
    methods: {
      previous () {
        console.log('clicked previous')
      },
      next () {
        this.$http.get(`/api/product/random?channelId=${this.channel}`)
          .then(response => { // Success
            if (response.data.success) {
              var id = response.data.product.id
              var name = response.data.product.name
              var description = response.data.product.description
              var pictureUrl = response.data.product.pictureUrl
              this.mutableProduct = new Classes.Product(id, name, description, pictureUrl)
            } else {
              this.failureMessage = response.data.message
            }
          }, response => { // Error
            console.log(response)
            this.failureMessage = response.data.message
          })
      },
      like () {
        var body = {
          channelId: this.channel
        }
        this.$http.post(`/api/product/like/${this.mutableProduct.id}`, body)
          .then(response => { // Success
            if (response.data.success) {
              this.failureMessage = response.data.message
              console.log('liked ' + this.mutableProduct.name)
              this.next()
            }
          }, response => { // Error
            console.log(response)
            this.failureMessage = response.data.message
          })
      },
      dislike () {
        this.$http.post(`/api/product/dislike/${this.mutableProduct.id}`)
          .then(response => { // Success
            if (response.data.success) {
              this.failureMessage = response.data.message
              console.log('disliked ' + this.mutableProduct.name)
              this.next()
            }
          }, response => { // Error
            console.log(response)
            this.failureMessage = response.data.message
          })
      }
    },
    mounted () {
      this.next()
    }
  }
</script>
