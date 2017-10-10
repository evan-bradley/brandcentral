<template> 
    <div class="column is-10 columns is-multiline">
        <div class="column is-12 is-centered">
            <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(User.Email) + '?s=46&d=identicon'" class="profile-image" />
            <h1 class="title">{{ User.FirstName }} {{ User.LastName }}</h1>
            <h1 class="subtitle">@{{ User.UserName }}</h1>
        </div>
        <div class="column is-12">
            <p class="subtitle">
                Items you have liked:
            </p>
        </div>  
       <div class="column is-2" v-for="item in likedItems" :key="item.ProductName">
           <VotingItem :item ="item" />
       </div>
    </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var md5 = require('md5');
import EditProfile from './EditProfile'
import VotingItem from './VotingItem.vue'

export default {
    name: 'Profile',
    data() {
        return {
            User: this.$store.state.User,
            pictures: []
        }
    },
    computed: {
        likedItems() {
            return [
                new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61CwVYR-nYL._SX522_.jpg'),
                new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/61bopQUes6L._UY679_.jpg'),
                new Classes.Item('productName', 'itemDescription', 'https://images-na.ssl-images-amazon.com/images/I/71hS1%2BG7XRL._SY679_.jpg')
            ] 
        }
    },
    components: {
        'EditProfile': EditProfile,
        'VotingItem': VotingItem
    },
    methods: {
        hash(str) {
            return md5(str)
        }
    }
}
</script>
