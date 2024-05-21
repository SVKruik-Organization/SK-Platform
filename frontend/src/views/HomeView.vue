<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue'

export default defineComponent({
    name: "HomeView",
    components: {
        Navbar
    }
});
</script>

<template>
    <Navbar></Navbar>
    <main>
        <RouterView></RouterView>
    </main>
</template>

<style>
body div:first-child {
    display: flex;
    flex-direction: column;
    gap: 100px;
    height: 100vh;
}
</style>
