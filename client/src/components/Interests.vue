<template>
  <section>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns has-text-centered">
          <div class="column">
            <h1 class="title">
              What are you interested in?
            </h1>
            <h2 class="subtitle">
              Select one or more of the options below to get started.
            </h2>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="columns is-mobile is-multiline">
        <div v-for="tag in tags" v-bind:key="tag.id" class="column is-one-quarter-desktop is-half-tablet is-full-mobile">
          <a class="box" v-on:click="toggleTagSelection(tag)" v-bind:class="{ 'selected-tag': selectedTags.includes(tag.TAG_ID) }">
            <h3 class="title is-6">
              <i class="fa fa-tag" style="opacity: 0.4; margin-right: 5px;" aria-hidden="true"></i>
              <span>{{ tag.TAG_DESC | capitalize}}</span>
            </h3>
          </a>
        </div>
      </div>
    </div>
  </section>
    <div class="container">
      <a class="button is-primary is-pulled-right" v-bind:disabled="selectedTags.length < 1" v-on:click="submitTags">Continue</a>
    </div>
</section>
</template>

<script>
  export default{
    name: 'Interests',
    data() {
      return {
        user: this.$store.state.User,
        tags: [],
        selectedTags: []
      }
    },
    created() {
      this.loadTags()
    },
    methods: {
      loadTags() {
        this.$http.get('/api/interests/tags')
        .then(response => {
          if (response.data.success) {
            this.tags = response.data.tags
          }
        }, response => {
          // Could not get any tags
        })
      },
      toggleTagSelection(tag) {
        if (this.selectedTags.includes(tag.TAG_ID)) {
          var deleteIndex = this.selectedTags.indexOf(tag.TAG_ID)
          this.selectedTags.splice(deleteIndex, 1)
        } else {
          this.selectedTags.push(tag.TAG_ID)
        }
      },
      submitTags() {
        if (!this.canSubmitTags()) return

        // Send the tags that the user selected to the server
        var body = {
          tags: this.selectedTags
        }
        this.$http.post('/api/interests/tags', body)
        .then(response => {
          if (response.data.success) {
            this.$router.push({ name: 'Browse' })
          }
        }, response => {
          // Tags could not be submitted
        })
      },
      canSubmitTags(){
        if (this.selectedTags.length >= 1) return true
      },
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
  }
</script>
<style scoped>
</style>
