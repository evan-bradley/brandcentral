<template>
  <div class="voting-item" >
    <div class="box">
      <figure class="image is-square" style="margin: -10px; overflow: hidden; border-radius: 5px;">
          <img :src="itemImageURL ? itemImageURL : item.ImmageURL" alt="Placeholder image">
      </figure>
      <hr style="margin: 20px -20px">
      <div class="media">
        <div class="media-content">
          <div class="title is-4" >
            <p class="has-text-left is-pulled-left">
              {{ itemName ? itemName : item.ProductName.substr(0, 50) + '...' }}
            </p>
          </div>
        </div>
      </div>
      <div class="content has-text-left" >
        {{ itemDescription ? itemDescription : item.ProductDescription  }}
      </div>
    </div>
    <div class="voting-button-container" style="margin-top: 20px">
      <div class="has-text-centered">
        <div class="field has-addons is-grouped is-grouped-centered">
          <!-- <p class="control">
            <a class="button is-medium" v-on:click.stop.prevent="previous" style="border-radius: 100px;">
              <span class="icon is-small">
                <i class="material-icons md-24">chevron_left</i>
              </span>
            </a>
          </p> -->
          <p class="control">
            <a class="button is-medium"  v-on:click.stop.prevent="dislike" style="border-radius: 100px;">
              <span class="icon is-small">
                <i class="material-icons md-24">thumb_down</i>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button is-medium"  v-on:click.stop.prevent="like" style="border-radius: 100px;">
              <span class="icon is-small">
                <i class="material-icons md-24">thumb_up</i>
              </span>
            </a>
          </p>
          <!-- <p class="control display-on-hover">
            <a class="button is-medium" v-on:click.stop.prevent="deletePreference" style="border-radius: 100px;">
              <span class="icon is-small">
                <i class="material-icons md-24">close</i>
              </span>
            </a>
          </p> -->
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
</template>


<script>
    // TOOO: This component should take in an id, and load the item based on the id.
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
  var axios = require('axios')
  var instance = axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/https://brandcentral.xyz',
    timeout: 1000,
  })

    export default {
      props: ['item', 'channel', 'userId'],
      data () {
        return {
          displayMode: true,
          itemName: '',
          itemDescription: '',
          itemImageURL: '',
          itemID: ''
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
          instance.get(`/api/product/random?channelId=${this.channel}`)
            .then(response => { // Success
              if (response.data.success) {
                this.itemName = response.data.product.name.substring(0, 30)
                this.itemDescription = response.data.product.description.substring(0, 80) + '...'
                this.itemImageURL = response.data.product.pictureUrl
                this.itemID = response.data.product.id
                window.focus()
              } else {
                this.failureMessage = response.data.message
              }
            }, response => { // Error
              console.log(response)
              this.failureMessage = response.data.message
            })
        },
        like () {
          const payload = {
            userId: this.userId,
            channelId: this.channel
          }

          instance.post(`/api/mobile/product/like/${this.itemID}`, payload)
            .then(response => { // Success
              if (response.data.success) {
                this.failureMessage = response.data.message
                console.log('liked ' + this.itemName)
                this.next()
              }
            }, response => { // Error
              console.log(response)
              this.failureMessage = response.data.message
            })
        },
        dislike () {
          const payload = {
            userId: this.userId,
            channelId: this.channel
          }

          instance.post(`/api/mobile/product/dislike/${this.itemID}`, payload)
            .then(response => { // Success
              if (response.data.success) {
                this.failureMessage = response.data.message
                console.log('disliked ' + this.itemName)
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
