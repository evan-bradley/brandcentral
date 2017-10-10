<template>
  <div>
    <div class="box">
        <div class="card-image">
            <figure class="image is-4by3">
                <img :src=item.ImmageURL alt="Placeholder image">
            </figure>
        </div>
        <div class="card-content">
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
    </div>
            <div v-show="!this.DisplayMode">
                <a v-on:click="GoLeft">
                    <i class="fa fa-hand-o-left fa-3x left-right-buttons has-text-centered" aria-hidden="true"></i>
                </a>
                <a v-on:click="UpVote">
                    <i class="fa fa-thumbs-o-up fa-3x upvote-button has-text-centered" aria-hidden="true"></i>
                </a>
                <a v-on:click="DownVote">
                    <i class="fa fa-thumbs-o-down fa-3x downvote-button has-text-centered" aria-hidden="true"></i>
                </a>
                <a v-on:click="GoRight">
                    <i class="fa fa-hand-o-right fa-3x left-right-buttons has-text-centered" aria-hidden="true"></i>
                </a>
            </div>
          </div>
</template>

<script>
    export default {
        props: ['item'],
        data() {
            return {
                DisplayMode: this.$route.name === 'Profile'
            }
        },
        computed:{
            CurrentItem: () => {
                return this.item
            }
        },
        methods:{
            GoLeft(){
                console.log('tried to go left')
            },
            GoRight(){
                console.log('tried to go right')
            },
            UpVote(){
                console.log('up voted ' + this.item.ProductName)
            },
            DownVote(){
                console.log('down voted ' + this.item.ProductName)
            }
        }
    }
</script>
