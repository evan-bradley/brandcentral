<template>
    <div class="columns is-multiline is-centered">
        <div class="column is-5">
           <voting-item :item ="this.CurrentItem" />
        </div>
    </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
import VotingItem from './VotingItem.vue'

    export default {
        props: ['ChannelId'],
        data() {
            return {
                CurrentItem: new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61rzIAnzTQL._UX522_.jpg')
            }
        },
        components: {
            'voting-item': VotingItem
        }
    }
</script>
