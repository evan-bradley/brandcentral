<template> 
    <div class="column is-10 columns is-multiline">
        <div class="column is-12 is-centered">
            <img v-bind:src="'https://secure.gravatar.com/avatar/' + hash(User.Email) + '?s=46&d=identicon'" class="profile-image" />
            <h1 class="title">{{ User.FirstName }} {{ User.LastName }}</h1>
            <h1 class="subtitle">@{{ User.UserName }}</h1>
        </div>
        <div>
            <p class="subtitle">
                Items you have liked:
            </p>
        </div>  
       <div class="column is-2" v-for="pic in pictures" :key="pic.id">
           <img :src="pic">
       </div>
    </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes
var md5 = require('md5');
import EditProfile from './EditProfile'

export default {
    name: 'Profile',
    data() {
        return {
            User: this.$store.state.User,
            pictures: []
        }
    },
    components: {
        'EditProfile': EditProfile
    },
    methods: {
        hash(str) {
            return md5(str)
        }
    }
}
</script>
