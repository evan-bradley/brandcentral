<template>
  <section class="section">
    <div v-if="users.length > 0">
      <div class="columns is-multiline">
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="user in users" :key="user.id">
          <div class='box' style='padding:0px;overflow:hidden;'>
            <UserItem :user="user" :shouldDisplayName="true"/>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <article class="message">
        <div class="message-body">
          This user is not following anyone
        </div>
      </article>
    </div>
  </section>
</template>

<script>
  import UserItem from './UserItem'

  export default {
    name: 'FollowingUsers',
    props: {
      userId: {
        required: true
      }
    },
    data () {
      return {
        users: []
      }
    },
    watch: {
      userId: function (newVal, oldVal) {
        this.loadUsers()
      }
    },
    components: {
      'UserItem': UserItem
    },
    created () {
      this.loadUsers()
    },
    methods: {
      loadUsers () {
        var userId = this.$route.params.userId
        this.$http.get(`/api/user/following/${userId}`)
          .then(response => {
            if (response.data.success) {
              this.users = response.data.following
            }
          }, response => {
            // Could not get any users
          })
      }
    }
  }
</script>
