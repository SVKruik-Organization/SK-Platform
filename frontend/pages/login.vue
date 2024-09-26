<script setup lang="ts">
import { useUserStore } from '@/stores/UserStore';

// Setup
const userStore = useUserStore();

// HTML Elements
const usernameInput: Ref<HTMLInputElement | null> = ref(null);
const passwordInput: Ref<HTMLInputElement | null> = ref(null);

// Methods
async function login(event: MouseEvent): Promise<void> {
    // Fetch
    event.preventDefault();
    if (!usernameInput.value || !passwordInput.value) return;
    const data = (await useFetchLogin(usernameInput.value.value, passwordInput.value.value)).value;

    // Parse
    if (typeof data === "boolean") return window.alert("Username/password incorrect.");
    userStore.setUser({
        "username": usernameInput.value.value,
        "token": data.access_token
    });
    useRouter().push("/");
}
</script>

<template>
    <main class="flex-col">
        <h1>Operator Login Page</h1>
        <form class="flex-col">
            <input ref="usernameInput" minlength="4" placeholder="Username" type="text">
            <input ref="passwordInput" minlength="8" placeholder="Password" type="password">
            <button type="submit" @click="login($event)">Submit</button>
        </form>
        <strong style="color: red; margin-top: 30px;">Authentication server is offline.</strong>
        <NuxtLink to="/" style="color: red; text-decoration: underline; font-weight: bold;">Go back home</NuxtLink>
    </main>
</template>

<style scoped></style>
