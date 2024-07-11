<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { fetchLogin } from '@/utils/fetch';

export default defineComponent({
    name: "LoginView",
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    methods: {
        /**
         * Logs the user in and creates a session.
         * @param event The click event.
         */
        async login(event: MouseEvent): Promise<void> {
            // Fetch
            event.preventDefault();
            const usernameInput: HTMLInputElement = this.$refs["usernameInput"] as HTMLInputElement;
            const passwordInput: HTMLInputElement = this.$refs["passwordInput"] as HTMLInputElement;
            const data = await fetchLogin(usernameInput.value, passwordInput.value);

            // Parse
            if (typeof data === "boolean") return window.alert("Username/password incorrect.");
            this.userStore.setUser({
                "username": usernameInput.value,
                "token": data.access_token
            });
            this.$router.push("/");
        }
    }
});
</script>

<template>
    <main class="flex-col">
        <h1>Operator Login Page</h1>
        <form class="flex-col">
            <input ref="usernameInput" minlength="4" placeholder="Username" type="text">
            <input ref="passwordInput" minlength="8" placeholder="Password" type="password">
            <button type="submit" @click="login($event)">Submit</button>
        </form>
    </main>
</template>

<style scoped></style>
