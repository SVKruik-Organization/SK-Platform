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
                <menu class="nav-links">
                    <RouterLink to="/product" class="nav-link">product</RouterLink>
                    <RouterLink to="/about" class="nav-link">about</RouterLink>
                    <RouterLink to="/docs" class="nav-link">docs</RouterLink>
                    <RouterLink to="/developer" class="nav-link">api</RouterLink>
                </menu>
            </section>
            <RouterLink to="/register" class="sign-up-button gradient-button">
                <p>sign up</p>
            </RouterLink>
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
    gap: 100px;
    margin: 0 auto;
    margin-top: 50px;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 30px;
}

.sign-up-button {
    display: block;
    background-color: var(--font);
    height: 30px;
    width: 100px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>