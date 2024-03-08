<script lang="ts">
import { RouterView } from 'vue-router';
import NavbarComponent from './components/Navbar.vue';
import FooterComponent from './components/Footer.vue';

export default {
    name: "App",
    components: { NavbarComponent, FooterComponent },
};
</script>

<template>
    <div class="content-container">
        <div>
            <NavbarComponent></NavbarComponent>
            <RouterView></RouterView>
        </div>
        <FooterComponent></FooterComponent>
    </div>
</template>

<style scoped>
.content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
}
</style>
