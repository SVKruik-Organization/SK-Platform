<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore";

// Setup
const userStore = useUserStore();
</script>

<template>
    <header>
        <nav>
            <section>
                <NuxtLink to="/">
                    <NuxtImg loading="lazy" alt="Logo" width="40" fit="cover" height="40" src="/seo/apple/Platform.png"
                        title="Home" />
                </NuxtLink>
            </section>
            <section>
                <menu class="nav-links">
                    <NuxtLink class="nav-link" to="/product">product</NuxtLink>
                    <NuxtLink class="nav-link" to="/plans">plans</NuxtLink>
                    <NuxtLink class="nav-link" to="/documentation">docs</NuxtLink>
                    <NuxtLink class="nav-link" to="/developer">api</NuxtLink>
                </menu>
            </section>
            <NuxtLink class="gradient-button sign-up-button" :title="userStore.user.username ? 'account' : 'login'"
                :to="userStore.user.username ? '/account' : '/login'">{{ userStore.user.username
                    ? "account" : "login" }}
            </NuxtLink>
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

img {
    border-radius: 50%;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 30px;
}

.sign-up-button {
    background-color: var(--font);
    background-size: 230% auto;
    height: 30px;
    width: 100px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>