<template>
    <div class="column is-4 is-offset-4 is-centered">
        <h1 class="title">Register</h1>
        <hr>
        <div class="small-padding">
            <label class="label">Username</label>
            <input class="input" type="text" placeholder="Username" v-model="user.UserName" />
        </div>
        <div class="small-padding">
            <label class="label">First Name</label>
            <input class="input" type="text" placeholder="Username" v-model="user.FirstName" />
        </div>
        <div class="small-padding">
            <label class="label">Last Name</label>
            <input class="input" type="text" placeholder="Username" v-model="user.LastName" />
        </div>
        <div class="small-padding">
            <label class="label">Password</label>
            <input class="input" type="password" placeholder="Password" v-model="user.Password" @keydown.enter="login" />
        </div>
        <div class="small-padding">
            <label class="label">Verfiy Password</label>
            <input class="input" type="password" placeholder="Password" v-model="emailVerfy" @keydown.enter="login" />
        </div>
        <div class="small-padding">
            <label class="label">Email</label>
            <input class="input" type="text" placeholder="Username" v-model="user.Email" />
        </div>
        <button class="button is-primary" @click="Register">Submit!</button>
        <button class="button is-warning" @click="ReturnToLogIn">Return to LogIn</button>
    </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

export default {
    name: 'Register',
    data() {
        return {
            user: new Classes.User(),
            emailVerfy: ''
        }
    },
    methods: {
        Register() {
            if (this.user.Password === this.emailVerfy && this.user.UserName !== "" && this.UserNameCheck(this.user.UserName)){
                // send to PHP to insert user
                this.$store.state.User = this.user
                this.$emit('Registered', this.user)
            }       
        },
        UserNameCheck(userName){
            // some PHP stuff to check the username
            return true
        },
        ReturnToLogIn(){
            this.$emit('Return')
        }
    }
}
</script>