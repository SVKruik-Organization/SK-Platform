<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";

// Setup
const userStore = useUserStore();
</script>

<template>
    <main class="flex-col">
        <h1>Account View</h1>
        <NuxtLink to="/">Home Page</NuxtLink>
        <button type="button" title="Logout" @click="userStore.signOut()">Logout</button>
        <NuxtPage />
    </main>
</template>
