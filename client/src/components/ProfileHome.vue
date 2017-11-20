<template>
  <section class="section">
    <div class="columns is-12">
      <div class="column is-narrow">
        <aside class="menu box" style="width: 250px;">
          <p class="menu-label">Settings</p>
          <ul class="menu-list">
            <li>
              <router-link v-bind:class="{ 'is-active': $route.name == 'editProfile' }" :to="{ name: 'editProfile' }">Profile</router-link>
            </li>
            <li>
              <router-link v-bind:class="{ 'is-active': $route.name == 'changePassword' }" :to="{ name: 'changePassword' }">Password</router-link>
            </li>
            <li>
              <router-link v-bind:class="{ 'is-active': $route.name == 'changeEmail' }" :to="{ name: 'changeEmail' }">Email</router-link>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column is-9">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>



<script>
  export default {
  }
</script>
