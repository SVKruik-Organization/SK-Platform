<script lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "NavbarComponent",
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    methods: {
        navigateLogin() {
            if (this.userStore.user.token) {
                this.$router.push("/account/overview")
            } else this.$router.push("/login");
        }
    }
});
</script>

<template>
    <header>
        <nav>
            <section>
                <RouterLink to="/home/landing">
                    <img alt="Logo">
                </RouterLink>
            </section>
            <section>
                <menu class="nav-links">
                    <RouterLink class="nav-link" to="/home/product">product</RouterLink>
                    <RouterLink class="nav-link" to="/home/pricing">pricing</RouterLink>
                    <RouterLink class="nav-link" to="/home/documentation">docs</RouterLink>
                    <RouterLink class="nav-link" to="/home/developer">api</RouterLink>
                </menu>
            </section>
            <button class="sign-up-button gradient-button" title="Login" type="button" @click="navigateLogin()">
                <p>account</p>
            </button>
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
    background-color: var(--font);
    height: 30px;
    width: 100px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>