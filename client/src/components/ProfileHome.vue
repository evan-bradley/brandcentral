<template>
    <div class="columns is-12">
        <div class="column is-2 is-offset-1">
            <aside class="menu">
                <p class="menu-label">Settings</p>
                <ul class="menu-list">
                    <li v-show="false">
                        <router-link :to="{ name: 'Profile' }">View My Profile</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'EditProfile' }">Profile</router-link>
                    </li>
                    <li>
                         <router-link :to="{ name: 'ChangePassword' }">Password</router-link>
                    </li>
                    <li>
                         <router-link :to="{ name: 'ChangeEmail' }">Email</router-link>
                    </li>
                </ul>               
            </aside>
        </div>
        <div class="column is-9">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>
