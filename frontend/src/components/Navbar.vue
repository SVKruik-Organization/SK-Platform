<script lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "NavbarComponent",
    setup() {
        return {
            userStore: useUserStore()
        }
    }
});
</script>

<template>
    <header>
        <nav>
            <section>
                <RouterLink to="/">
                    <img alt="Logo" src="/Bot.png" title="Home">
                </RouterLink>
            </section>
            <section>
                <menu class="nav-links">
                    <RouterLink class="nav-link" to="/product">product</RouterLink>
                    <RouterLink class="nav-link" to="/plans">plans</RouterLink>
                    <RouterLink class="nav-link" to="/documentation">docs</RouterLink>
                    <RouterLink class="nav-link" to="/developer">api</RouterLink>
                </menu>
            </section>
            <RouterLink class="sign-up-button gradient-button" :title="userStore.user.username ? 'account' : 'login'"
                :to="userStore.user.username ? '/account/overview' : '/login'">{{ userStore.user.username ? "account" :
                    "login" }}</RouterLink>
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
    object-fit: cover;
    height: 40px;
    aspect-ratio: 1 / 1;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 30px;
}

.sign-up-button {
    background-color: var(--font);
    height: 30px;
    width: 100px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>