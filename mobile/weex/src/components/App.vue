<template>
  <div class="columns is-multiline">
    <div class="column is-12" v-show="loggedIn" :class="{ 'no-pading-or-margins' : (!loggedIn) }">
      <Navbar :user="user" v-on:LogOut="LogOut" :channelName="channelName" v-on:GoBackAChannel="GoBackAChannel"/>
      <!-- <button class="is-pulled-right button is-primary" @click="LogOut">Log out</button> -->
    </div>
    <div class="column is-12" :class="{ 'no-pading-or-margins' : (display !== 1) }">
      <LogIn v-show="display === 1"  v-on:navigate="changeDisplay" v-on:LogIn="LogIn" :loggedIn="loggedIn" />
    </div>
    <div class="column is-12" :class="{ 'no-pading-or-margins' : (display !== 2) }">
      <Register v-show="display === 2" v-on:navigate="changeDisplay"/>
    </div>
    <div class="column is-12" :class="{ 'no-pading-or-margins' : (display !== 3) }">
      <RecoverPassword v-show="display === 3" v-on:navigate="changeDisplay"/>
    </div>
    <div class="column is-12" :class="{ 'no-pading-or-margins' : (display !== 4 && loggedIn) }"> 
      <Channel v-show="display === 4 && loggedIn" v-on:navigate="changeDisplay" :userId="user.Id" v-on:changeChannel="setChannelName" :showChannelSelect="showChannelSelect" v-on:selectedChannel="showChannelSelect = false"/>
    </div>
  </div>
</template>

<script>
import LogIn from "./LogIn.vue"
import Register from "./Register.vue"
import RecoverPassword from "./RecoverPassword.vue"
import Channel from "./Channel.vue"
import Navbar from "./Navbar.vue"
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var axios = require("axios");
var instance = axios.create({
  baseURL: "https://cors-anywhere.herokuapp.com/https://brandcentral.xyz",
  timeout: 1000
});

export default {
  data() {
    return {
      display: 1,
      loggedIn: false,
      user: new Classes.User(),
      channelName: "",
      showChannelSelect: true
    };
  },
  components: {
    LogIn: LogIn,
    Register: Register,
    RecoverPassword: RecoverPassword,
    Channel: Channel,
    Navbar: Navbar
  },
  methods: {
    changeDisplay(number) {
      if (this.loggedIn) {
        this.display = 1;
      } else {
        this.display = number;
      }
    },
    LogIn (user) {
      this.loggedIn = true
      this.display = 4
      this.user = user
    },
    LogOut () {
      this.loggedIn = false
      this.display = 1
    },
    setChannelName(nameToChangeTo) {
      if (nameToChangeTo !== 'General') {
        this.channelName = nameToChangeTo
      }
    },
    GoBackAChannel (){
      this.channelName = ""
      this.showChannelSelect = true;
    }
  }
};
</script>

<style src="../../styles/site.css"></style>