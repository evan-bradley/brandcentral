<template>
  <div>
    <LogIn v-show="display === 1" v-on:navigate="changeDisplay" />
    <Register v-show="display === 2" v-on:navigate="changeDisplay"/>
    <RecoverPassword v-show="display === 3" v-on:navigate="changeDisplay"/>
  </div>
</template>

<script>
import LogIn from './LogIn.vue'
import Register from './Register.vue'
import RecoverPassword from './RecoverPassword.vue'

  export default {
    data(){
      return {
        'display': 1,
        'LoggedIn': false
      }
    },
    components: {
      'LogIn': LogIn,
      'Register': Register,
      'RecoverPassword': RecoverPassword 
    },
    methods: {
      changeDisplay(number) {
        if(this.LoggedIn) {
          this.display = 1
        } else {
          this.display = number
        }
      }
    }  
  }
</script>

<style src="../../styles/site.css"></style>