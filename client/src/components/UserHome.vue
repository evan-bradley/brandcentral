<template>
    <div class="column is-8 is-offset-2">
        <div class="column is-12">
            <h1 class="Title is-size-3 is-pulled-left">Welcome {{ User.FirstName }}!</h1>
            <a>
                <h3 class="Title is-pulled-right is-size-5" @click="UpdateEditData">Edit Profile</h3>
            </a>
        </div>
        <div class="column is-12 columns is-multiline" v-show="!EditEnabled && !ChangePassword">
            <div class="column is-12 is-size-5">
                User Name: {{ User.UserName }}
            </div>
            <div class="column is-12 is-size-5">
                First Name: {{ User.FirstName }}
            </div>
            <div class="column is-12 is-size-5">
                Last Name: {{ User.LastName }}
            </div>
            <div class="column is-12 is-size-5">
                Password: did you really think we would display this
            </div>
            <div class="column is-12 is-size-5">
                Email: {{ User.Email }}
            </div>
        </div>
        <div class="column is-12 columns is-multiline" v-show="EditEnabled">
            <div class="column is-12 is-size-5">
                User Name: <input type="text" class="is-centered" v-model="EditUser.UserName">
            </div>
            <div class="column is-12 is-size-5">
                First Name: <input type="text" class="is-centered" v-model="EditUser.FirstName">
            </div>
            <div class="column is-12 is-size-5">
                Last Name: <input type="text" class="is-centered" v-model="EditUser.LastName">
            </div>
            <div class="column is-12 is-size-5">
                Password:
                <button class="button is-primary" @click="ChangePasswordNavigation">I want to change my password</button>
            </div>
            <div class="column is-12 is-size-5">
                Email: <input type="text" class="is-centered" v-model="EditUser.Email">
            </div>
            <button class="button is-success" @click="Update">Save</button>
        </div>
        <div class="column is-12 columns is-multiline" v-show="ChangePassword">
            <h1 class="title is-size-2.5">Change your password</h1>
            <div class="column is-12 is-size-5">
                Current Password: <input type="text" class="is-centered" v-model="PasswordChange.CurrentPassword">
            </div>
            <div class="column is-12 is-size-5">
                First Name: <input type="text" class="is-centered" v-model="PasswordChange.NewPassword">
            </div>
            <div class="column is-12 is-size-5">
                Last Name: <input type="text" class="is-centered" v-model="PasswordChange.VerifyNewPassword">
            </div>
            <button class="button is-primary large-margins" @click="TryAndChangePassword">Change Password</button>
            <button class="button is-danger large-margins" @click="BackToUserHome">I don't want to change it anymore</button>
        </div>
    </div>
</template>

<script>
var Classes = require('../TypeScriptFolder/Compliled/Classes').Classes

export default {
    name: 'UserHome',
    data() {
        return {
            User: this.$store.state.User,
            EditUser: new Classes.User(),
            EditEnabled: false,
            ChangePassword: false,
            PasswordChange: new Classes.PasswordVerification()
        }
    },
    methods: {
        Update() {
            const updateInfo = {
              username: this.$store.state.User.UserName
            }

            if (this.$store.state.User.FirstName !== this.EditUser.FirstName) {
              updateInfo.firstname = this.EditUser.FirstName
              this.$store.state.User.FirstName = this.EditUser.FirstName
            }

            if (this.$store.state.User.LastName !== this.EditUser.LastName) {
              updateInfo.lastname = this.EditUser.LastName
              this.$store.state.User.LastName = this.EditUser.LastName
            }

            if (this.$store.state.User.Email !== this.EditUser.Email) {
              updateInfo.email = this.EditUser.Email
              this.$store.state.User.Email = this.EditUser.Email
            }

            this.$store.state.User.UserName = this.EditUser.UserName
            this.User.FirstName = this.EditUser.FirstName
            this.User.LastName = this.EditUser.LastName
            this.User.Email = this.EditUser.Email
            this.User.UserName = this.EditUser.UserName
            this.EditEnabled = false
            this.$http.post('/api/profile', updateInfo)
            .then(response => {
              console.log(response)
            }, response => {
              console.log(response)
            })
        },
        UpdateEditData() {
            this.EditUser.FirstName = this.User.FirstName
            this.EditUser.LastName = this.User.LastName
            this.EditUser.Email = this.User.Email
            this.EditUser.UserName = this.User.UserName
            this.EditEnabled = !this.EditEnabled
            this.ChangePassword = false
        },
        ChangePasswordNavigation() {
            this.EditEnabled = false
            this.ChangePassword = true
        },
        TryAndChangePassword() {
            if (this.PasswordChange.Verify(this.$store.state.User.Password)) {
                this.$store.state.User.Password = this.PasswordChange.NewPassword
                this.ChangePassword = false
            }
        },
        BackToUserHome() {
            this.PasswordChange = new Classes.PasswordVerification()
            this.EditEnabled = false
            this.ChangePassword = false
        }
    }
}
</script>
