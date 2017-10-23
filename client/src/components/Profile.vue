<template>
  <div>
    <div v-if="user">
      <section class="section">
        <div class="is-centered">
          <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(user.Email) + '?s=96&d=identicon'" class="profile-image" />
          <h1 class="title is-4">{{ user.FirstName }} {{ user.LastName }}</h1>
          <h1 class="subtitle">@{{ user.UserName }}</h1>
          <span v-if="following()">
              <a class="button is-primary"  @click="unfollow()">
                Unfollow
              </a>
            </span>
            <span v-else>
              <a class="button" @click="follow()">
                Follow
              </a>
            </span>
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
  </div>
</template>



<script>
  import EditProfile from './EditProfile'
  import VotingItem from './VotingItem.vue'
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
  var md5 = require('md5')

  export default {
    name: 'Profile',
    props: ['userId'],
    data () {
      return {
        user: undefined
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
    watch: {
      userId: function (newVal, oldVal) {
        this.loadUserInformation()
      }
    },
    components: {
      'EditProfile': EditProfile,
      'VotingItem': VotingItem
    },
    created () {
      this.loadUserInformation()
    },
    methods: {
      hash (str) {
        return md5(str)
      },
      loadUserInformation () {
        var userId = this.$route.params.userId
        this.$http.get(`/api/profile/${userId}`)
        .then(response => {
          if (response.data.success) {
            this.user = new Classes.User()
            this.user.Id = Number(userId)
            this.user.FirstName = response.body.user[0].USER_FNAME
            this.user.LastName = response.body.user[0].USER_LNAME
            this.user.UserName = response.body.user[0].USERNAME
            this.user.Email = 'md5 hash from server goes here'
          }
        }, response => {
          console.log('Failed to load channel information')
        })
      },
      following () {
        var userId = this.user.Id
        var followedUsers = this.$store.state.followedUsers
        var following = followedUsers.some(function (element) {
          return element.id === userId
        })
        return following
      },
      follow () {
        this.$http.post(`/api/user/follow/${this.user.Id}`)
        .then(response => {
          if (response.data.success) {
            var user = {
              id: this.user.Id,
              username: this.user.UserName
            }
            this.$store.commit('addFollowedUser', user)
          }
        }, response => {
          console.log('Failed to follow')
        })
      },
      unfollow () {
        this.$http.post(`/api/user/unfollow/${this.user.Id}`)
        .then(response => {
          if (response.data.success) {
            this.$store.commit('removeFollowedUser', this.user.Id)
          }
        }, response => {
          console.log('Failed to unfollow')
        })
      },
      isAuthenticatedUser () {
      }
    }
  }
</script>
