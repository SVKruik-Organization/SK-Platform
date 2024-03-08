<script lang="ts">
export default {
    name: "NavbarComponent"
};
</script>

<template>
    <header>
        <nav>
            <section>
                <img src="/favicon.ico" alt="Logo">
            </section>
            <section>
                <menu>
                    <RouterLink to="/product" class="nav-link">Product</RouterLink>
                    <RouterLink to="/about" class="nav-link">About</RouterLink>
                    <RouterLink to="/docs" class="nav-link">Docs</RouterLink>
                    <RouterLink to="/developer" class="nav-link">API</RouterLink>
                </menu>
            </section>
            <section>
                <RouterLink to="/register">Sign-up</RouterLink>
            </section>
        </nav>
    </header>
</template>

<style scoped>
header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

nav {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-top: 10px;
    margin: 0 auto;
}

.nav-links {
    display: flex;
    align-items: center;
}
</style>