<template>
  <div id="app" class="columns is-multiline">
    <div class="column is-12">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="./assets/bcslogo.png" height="35">
          </a>
        </div>
        <div class="navbar-item" v-show="this.$store.state.user">
          <router-link to="/">Home</router-link>
        </div>
        <div class="navbar-end" v-show="this.$store.state.user">
          <div class="navbar-item" v-show="this.$store.state.user">
            <router-link :to="{ name: 'EditUser', params: { UserId: this.$store.state.user }  }" ><i class="fa fa-user-circle"></i></router-link>
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
export default {
  name: 'app'
}
</script>

<style src="../styles/site.css"></style>