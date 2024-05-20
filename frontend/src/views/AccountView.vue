<script lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "AccountView",
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    mounted() {
        if (!this.userStore.user.token) return this.$router.push("/unauthorized");
    }
});
</script>

<template>
    <div class="parent">
        <main>
            <h1>Account View</h1>
            <RouterLink to="/home/landing">Home Page</RouterLink>
            <RouterView></RouterView>
        </main>
    </div>
</template>

<style scoped></style>
