<script setup lang="ts">
import type { RouteLocation } from "vue-router";
import "~/assets/css/base.css";
import "~/assets/css/docpage.css";
import "~/assets/css/interaction.css";

// Setup
const route = useRoute();

// SEO
useHead({
    title: "SK Platform",
    htmlAttrs: {
        lang: "en"
    }
});

// Watchers
watch(() => route, (to: RouteLocation, _from: RouteLocation) => {
    let suffix: string = to.path.split("/")[1];
    if (suffix.length) {
        suffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
    } else suffix = "Home";
    document.title = `SK Platform | ${suffix}`;
});
</script>

<template>
    <NuxtPage />
</template>
