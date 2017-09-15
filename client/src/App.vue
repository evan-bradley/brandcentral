<template>
  <div id="app" class="columns is-multiline">
    <div class="column is-12">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="./assets/logo.png" height="35">
          </a>
        </div>
        <div v-show="loggedIn">
          <hr class="navbar-divider">
          <div class="navbar-item">
            <p>Home</p>
          </div>
        </div>
      </nav>
    </div>
    <div class="column is-12">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import store from './Vuex/states'
import {mapState} from 'vuex'

export default {
  name: 'app',
computed: mapState({
      loggedIn: state => state.loggedIn
})
}
</script>

<style src="../styles/site.css"></style>