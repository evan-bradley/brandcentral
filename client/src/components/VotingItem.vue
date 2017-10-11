<template>
  <div>
    <div class="box">
        <figure class="image is-square" style="margin: -10px; overflow: hidden; border-radius: 5px;">
            <img :src=item.ImmageURL alt="Placeholder image">
        </figure>
      <hr style="margin: 20px -20px">
      <div class="media">
        <div class="media-content">
          <div :class="[this.DisplayMode ? 'subtitle is-5':'title is-4']">
            <p class="has-text-left is-pulled-left">
              {{ item.ProductName }}
            </p>
          </div>
        </div>
      </div>
      <div class="content has-text-left" v-show="!this.DisplayMode">
        {{ item.ItemDescription }}
      </div>
    </div>
    <div v-show="!this.DisplayMode">
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
    export default {
        props: ['item'],
        data() {
            return {
                DisplayMode: this.$route.name === 'Profile' || this.$route.name === 'BrowseProfile'
            }
        },
        computed:{
            CurrentItem: () => {
                return this.item
            }
        },
        methods:{
            previous(){
                console.log('clicked previous')
            },
            next(){
                console.log('clicked next')
            },
            like(){
                console.log('liked ' + this.item.ProductName)
            },
            dislike(){
                console.log('liked ' + this.item.ProductName)
            }
        }
    }
</script>
