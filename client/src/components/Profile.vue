<template>
  <div>
    <section class="section">
      <div class="is-centered">
        <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(User.Email) + '?s=96&d=identicon'" class="profile-image" />
        <h1 class="title is-4">{{ User.FirstName }} {{ User.LastName }}</h1>
        <h1 class="subtitle">@{{ User.UserName }}</h1>
      </div>
    </section>
    <div class="tabs is-centered is-boxed">
      <ul>
        <li class="is-active">
          <a>
            <i class="fa fa-heart" style="margin-right: 5px;" aria-hidden="true"></i>
            <span>Likes</span>
          </a>
        </li>
        <li>
          <a disabled>
            <i class="fa fa-tag" style="margin-right: 5px;" aria-hidden="true"></i>
            <span>Channels</span>
          </a>
        </li>
        <li>
          <a>
            <i class="fa fa-user" style="margin-right: 5px;" aria-hidden="true"></i>
            <span>Following</span>
          </a>
        </li>
      </ul>
    </div>
    <section class="section">
      <div class="columns is-multiline">
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="item in likedItems" :key="item.ProductName">
          <VotingItem :item="item" />
        </div>
      </div>
    </section>
  </div>
</template>



<script>
  import EditProfile from './EditProfile'
  import VotingItem from './VotingItem.vue'
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
  var md5 = require('md5')

  export default {
    name: 'Profile',
    data () {
      return {
        User: this.$store.state.User,
        pictures: []
      }
    },
    computed: {
      likedItems () {
        return [
          new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61CwVYR-nYL._SX522_.jpg'),
          new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61bopQUes6L._UY679_.jpg'),
          new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/71hS1%2BG7XRL._SY679_.jpg')
        ]
      }
    },
    components: {
      'EditProfile': EditProfile,
      'VotingItem': VotingItem
    },
    methods: {
      hash (str) {
        return md5(str)
      }
    }
  }
</script>
