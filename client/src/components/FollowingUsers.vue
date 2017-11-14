<template>
  <div class="followed-users-container">
    <div v-if="users.length > 0">
      <div class="columns is-multiline">
        <div class="column is-one-quarter is-half-tablet is-12-mobile" v-for="user in users" :key="user.id">
          <div class='box' style='padding:0px;overflow:hidden;'>
            <UserRow :user="user" :shouldDisplayName="true"/>
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
  </div>
</template>

<script>
  import UserRow from './UserRow'

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
      'UserRow': UserRow
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
