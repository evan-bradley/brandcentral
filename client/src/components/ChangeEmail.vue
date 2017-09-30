<template>
    <div class="column is-10">
        <div class="column is-12 columns is-multiline">
            <div class="column is-12 is-size-5">
                <h1 class="title is-size-2.5">Change your email address</h1>
                <div class="field">
                    <label class="label">Current email address</label>
                    <div class="control">
                        <input class="input" type="password" placeholder="Current email address"  v-model="OldEmail"/>
                    </div>
                </div>
                <div class="field">
                    <label class="label">New email address</label>
                    <div class="control">
                        <input class="input" type="password" placeholder="New email address" v-model="NewEmail"/>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Current Password</label>
                    <div class="control">
                        <input class="input" type="password" placeholder="Password" v-model="password"  />
                    </div>
                </div>
                <button class="button is-primary" @click="UpdateEmail">Change email address</button>
                <router-link class="button is-pulled-right" :to="{ name: 'EditProfile' }">Cancel</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                NewEmail: '',
                OldEmail: '',
                password: ''
            }
        },
        methods: {
            UpdateEmail(){
                const EmailChangeInfo = {
                    NewEmail: this.NewEmail,
                    username: this.$store.state.User.UserName
                }

            //    this.$http.post('/api/changeEmail',EmailChangeInfo)
            //    .then(response =>{
            //        if(response.data.success){

            //        }
            //        else{

            //        }
            //    }) 
            }
        }
    }
</script>

<style scoped>

</style>