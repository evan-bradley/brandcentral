<template>
  <div id="app" class="columns is-multiline">
    <div class="column is-12">
      <nav v-show="this.$store.state.loggedIn" class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="./assets/brand_central_full.png" height="50">
          </a>
        </div>
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <img src="https://secure.gravatar.com/avatar/9c789dff1d20cc49a6f0b0df8c6308db?s=46&d=identicon" class="profile-image"/>
              <p>jpherkness</p>
            </a>
            <div class="navbar-dropdown">
              <div class="navbar-item">
                <b>Joseph Herkness</b>
              </div>
              <router-link :to="{ name: 'Profile' }" class="navbar-item">Profile</router-link>
              <a class="navbar-item">Settings</a>
              <a class="navbar-item">Help</a>
              <hr class="navbar-divider">
              <a class="navbar-item">Sign out</a>
            </div>
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