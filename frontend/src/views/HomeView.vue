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
    <div class="parent">
        <Navbar></Navbar>
        <main>
            <RouterView></RouterView>
        </main>
    </div>
</template>

<style scoped>
.parent {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 100px;
}
</style>
