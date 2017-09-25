<template>
  <div id="app" class="columns is-multiline">
    <div class="column is-12">
      <navbar></navbar>
    </div>
    <div class="column is-12">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
export default {
  name: 'app',
  components: {
    'navbar': Navbar
  }
}
</script>

<style src="../styles/site.css"></style>