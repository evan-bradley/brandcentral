<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h4 class="title has-text-centered is-4">
              <img src="../assets/brand_central_icon.png" style="max-width: 20%">
            </h4>
            <div class="box">
              <h4 class="title has-text-centered is-4">Recover Password</h4>
              <article class="message is-danger" v-show="failureMessage">
                <div class="message-body">
                  {{ failureMessage }}
                </div>
              </article>

              <div class="field">
                <label class="label">Account Email</label>
                <div class="control">
                  <input class="input" type="text" placeholder="Email" name="email" v-model="Email" v-validate="{ required: true, email: true}"/>
                </div>
                <p class="help is-danger" v-show="errors.has('email')">{{ errors.first('email') }}</p>
              </div>

              <hr>
              <div class="control">
                <button class="button is-primary" @click="SendEmail">Recover Password</button>
                <router-link class="button is-pulled-right" :to="{ name: 'Login' }">Cancel</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
  export default {
    data(){
      return {
        Email: ''
      }
    },
    methods: {
      SendEmail(){
        const SendEmailInfo = {
          //Email: this.Email,
          //username: this.$store.state.User.UserName
        }

        //    this.$http.post('/api/changeEmail',EmailChangeInfo)
        //    .then(response =>{
        //        if(response.data.success){

        //        }
        //        else{

        //        }
        //    })
      }
    }
  }

</script>
