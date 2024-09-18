<script lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "AccountView",
    setup() {
        return {
            userStore: useUserStore()
        }
    }
});
</script>

<template>
    <main class="flex-col">
        <h1>Account View</h1>
        <NuxtLink to="/">Home Page</NuxtLink>
        <button type="button" title="Logout" @click="userStore.signOut()">Logout</button>
        <NuxtPage />
    </main>
</template>

<style scoped></style>
