<template>
  <div id="app">
    <Slideout menu="#side" panel="#main" :toggleSelectors="['.toggle-button']">
      <div id="side">
        <SideMenu class="aside" style="min-width: 0px;"></SideMenu>
      </div>
      <div id="main">
        <Navbar v-cloak v-show="!$route.meta.hideNav"></Navbar>
        <router-view></router-view>
      </div>
    </Slideout>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import SideMenu from './components/SideMenu.vue'
import Slideout from 'vue-slideout'
export default {
  name: 'app',
  components: {
    'Navbar': Navbar,
    'Slideout': Slideout,
    'SideMenu': SideMenu
  }
}
</script>

<style src="../styles/site.css"></style>
