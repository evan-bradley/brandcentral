<template>
    <div class="columns is-multiline is-centered">
        <div class="column is-5">
           <voting-item :item ="this.currentItem" :channel="this.channel" />
        </div>
    </div>
</template>

<script>
  import VotingItem from './VotingItem.vue'
  var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

  export default {
    props: ['channel'],
    data () {
      return {
        currentItem: new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61rzIAnzTQL._UX522_.jpg')
      }
    },
    components: {
      'voting-item': VotingItem
    }
  }
</script>
