<template>
  <div class="columns">
    <div class="column is-2">
      <section class="hero">
        <aside class="menu">
          <p class="menu-label is-centered">
            Channels Menu
          </p>
          <hr>
          <ul class="menu-list">
            <h1 class="heading is-centered">Channels</h1>
            <div v-for="channel in channels" :key="channel" class="heading is-centered" >
              <router-link :to="{ name: 'Channel', params:{ ChannelId: channel } }">{{ channel }}</router-link>
            </div>
            <br>
            <h1 class="heading is-centered">Recent Channels</h1>
            <!-- when we start adding channels we need to make them router links-->
          </ul>
        </aside>
      </section>
    </div>
    <div class="column is-9">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
     data(){
            return {
                channels: ['TestChannel']
            }
        }
  }
</script>