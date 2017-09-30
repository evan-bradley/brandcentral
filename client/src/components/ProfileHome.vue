<template>
    <div class="columns is-12">
        <div class="column is-2 is-offset-1">
            <aside class="menu">
                <p class="menu-label">
                    User Menu
                </p>
                <ul class="menu-list">
                    <li>
                        <router-link :to="{ name: 'Profile' }">View My Profile</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'EditProfile' }">Edit My Profile</router-link>
                    </li>
                    <li>
                         <router-link :to="{ name: 'ChangePassword' }">Change My Password</router-link>
                    </li>
                    <li>
                         <router-link :to="{ name: 'ChangeEmail' }">Change My Email</router-link>
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
