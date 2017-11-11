<template>
  <div>
    <LogIn v-show="display === 1" :baseURL="baseURL" v-on:navigate="changeDisplay" />
    <Register v-show="display === 2" :baseURL="baseURL" v-on:navigate="changeDisplay"/>
    <RecoverPassword v-show="display === 3" :baseURL="baseURL" v-on:navigate="changeDisplay"/>
  </div>
</template>

<script>
import LogIn from './LogIn.vue'
import Register from './Register.vue'
import RecoverPassword from './RecoverPassword.vue'
var axios = require('axios')
var instance = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/https://brandcentral.xyz',
  timeout: 1000,
})

  export default {
    data(){
      return {
        'display': 1,
        'loggedIn': false
      }
    },
    components: {
      'LogIn': LogIn,
      'Register': Register,
      'RecoverPassword': RecoverPassword 
    },
    methods: {
      changeDisplay(number) {
        if(this.loggedIn) {
          this.display = 1
        } else {
          this.display = number
        }
      }
    }  
  }
</script>

<style src="../../styles/site.css"></style>