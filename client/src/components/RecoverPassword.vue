<template>
  <div class="column is-10">
    <div class="column is-12 columns is-multiline">
      <div class="column is-12 is-size-5">
        <h1 class="title is-size-2.5">Recover Your Password</h1>
        <div class="field">
          <label class="label">Current email address</label>
          <div class="control">
            <input class="input" type="password" placeholder="Current email address"  v-model="Email"/>
          </div>
        </div>
        <button class="button is-primary" @click="SendEmail">Recover Password</button>
        <router-link class="button is-pulled-right" :to="{ name: 'Login' }">Cancel</router-link>
      </div>
    </div>
  </div>
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
