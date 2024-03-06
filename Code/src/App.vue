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
    <NavbarComponent></NavbarComponent>
    <RouterView></RouterView>
    <FooterComponent></FooterComponent>
</template>

<style scoped></style>
