<template>
  <div class="column is-10">
    <div class="column is-12 columns is-multiline">
      <div class="column is-12 is-size-5">
        <h1 class="title is-size-2.5">Email</h1>
        <article class="message is-danger" v-show="failureMessage">
          <div class="message-body">
            {{ failureMessage }}
          </div>
        </article>
        <div class="field">
          <label class="label">New Email</label>
          <div class="control">
            <input class="input" type="text" placeholder="Email" name="email" v-model="newEmail" v-validate="{ required: true, email: true}"
            />
          </div>
          <p class="help is-danger" v-show="errors.has('email')">{{ errors.first('email') }}</p>
        </div>
        <div class="field">
          <label class="label">Current Password</label>
          <div class="control">
            <input class="input" type="password" placeholder="Password" v-model="password" />
          </div>
        </div>
        <button class="button is-primary" @click="changeEmail">Change email address</button>
        <router-link class="button is-pulled-right" :to="{ name: 'EditProfile' }">Cancel</router-link>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    data () {
      return {
        newEmail: '',
        password: '',
        user: this.$store.state.User,
        failureMessage: ''
      }
    },

    methods: {
      changeEmail () {
        // Quit if any inputs are invalid
        this.$validator.validateAll()
        if (this.errors.any()) {
          return
        }

        const body = {
          id: this.user.Id,
          NewEmail: this.newEmail,
          currentEmail: this.user.Email,
          password: this.password
        }

        this.$http.post(`/api/profile/ChangeEmail/${this.user.Id}`, body)
          .then(response => {
            if (response.body.success) {
              this.user.Email = body.NewEmail
              this.$router.push({ name: 'EditProfile' })
            } else {
              console.log(response)
              this.failureMessage = response.data.message
            }
          }, response => {
            console.log(response)
          })
      }
    }
  }
</script>
