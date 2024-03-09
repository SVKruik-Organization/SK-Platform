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
        <NavbarComponent class="nav"></NavbarComponent>
        <RouterView class="content"></RouterView>
        <FooterComponent class="footer"></FooterComponent>
    </div>
</template>

<style scoped>
.content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh;
}

/* .footer {
    margin-top: auto;
} */

.content {
    height: 100%;
}
</style>
