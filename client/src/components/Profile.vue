<template>
  <div>
    <div v-if="user">
      <section class="section">
        <div class="is-centered">
          <img v-bind:src="'https://secure.gravatar.com/avatar/' + this.emailHash+ '?s=96&d=identicon'" class="profile-image" />
          <h1 class="title is-4">{{ user.FirstName }} {{ user.LastName }}</h1>
          <h1 class="subtitle">@{{ user.UserName }}</h1>
          <div v-if="user.Id != this.$store.state.User.Id">
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
          <div v-else>
            <router-link :to="{ name: 'editProfile' }" class="button">
              Edit Profile
            </router-link>
          </div>
        </div>
      </section>
      <div class="tabs ">
        <ul>
          <li v-bind:class="{ 'is-active': $route.name == 'profile' }">
            <router-link :to="{ name: 'profile' }">
              <span>Likes</span>
            </router-link>
          </li>
          <li v-bind:class="{ 'is-active': $route.name == 'channels' }">
            <router-link :to="{ name: 'channels' }">
              <span>Channels</span>
            </router-link>
          </li>
          <li v-bind:class="{ 'is-active': $route.name == 'following' }">
            <router-link :to="{ name: 'following' }">
              <span>Following</span>
            </router-link>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>



<script>
  import EditProfile from './EditProfile'
  import LikedProducts from './LikedProducts.vue'
  var Classes = require('../TypeScriptFolder/Compiled/Classes').Classes
  var md5 = require('md5')

  export default {
    name: 'Profile',
    props: {
      userId: {
        required: true
      }
    },
    data () {
      return {
        user: undefined,
        emailHash: ''
      }
    },
    watch: {
      userId: function (newVal, oldVal) {
        this.loadUserInformation()
      }
    },
    components: {
      'EditProfile': EditProfile,
      'LikedProducts': LikedProducts
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
            this.user.FirstName = response.body.user.firstName
            this.user.LastName = response.body.user.lastName
            this.user.UserName = response.body.user.username
            this.emailHash = response.body.user.emailHash
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
      }
    }
  }
</script>
