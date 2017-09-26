<template>
    <div>
        <div class="columns column is-12">
            <div class="column is-6 is-offset-3 is-centered">
                <div v-show="VerifyDisplayFlags.Loading">
                    <i class="fa fa-circle-o-notch fa-spin fa-fw fa-huge"></i>
                </div>
                <div v-show="VerifyDisplayFlags.Failed">
                    <p class="notification is-danger">Ops! Something went wrong please try again </p>
                </div>
                <div v-show="!VerifyDisplayFlags.Loading && !VerifyDisplayFlags.Failed">
                    <h1 class="title is-size-2">Your email has been verified!</h1>
                </div>
            </div>
        </div>
        <div class="column is-12 is-centered" v-show="!VerifyDisplayFlags.Loading">
            <router-link to="/" class="button is-primary is-large">Go to login page</router-link>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        GUID: {
            default: ''
        }
    },
    data() {
        return {
            VerifyDisplayFlags: {
                Loading: true,
                Failed: false
            }
        }
    },
    mounted() {
        this.$http.post(`/api/verify/${this.GUID}`)
            .then(response => {
                if (response.body.success) {
                    this.$router.push({ name: 'Login' })
                }
            }, response => {
                console.log(response)
            })
        // go do the DB verification 
        //the folowing line will display the you have been verified question
        //this.VerifyDisplayFlags.Loading = false;

        // the following 2 lines will dispaly the error message
        // this.VerifyDisplayFlags.Loading = false;
        // this.VerifyDisplayFlags.Failed = true;
    }
}
</script>
