<script setup lang="ts">
import type { RouteLocation } from "vue-router";
import "~/assets/css/base.css";
import "~/assets/css/docpage.css";
import "~/assets/css/interaction.css";

// Setup
const route = useRoute();

// SEO
const metaItems = [
    { name: "keywords", content: "SK Platform - your central hub for managing SK products, accounts, services and documentation." },
    { name: "author", content: "Stefan Kruik, platform@stefankruik.com" },
    { name: "owner", content: "Stefan Kruik" },
    { name: "color-scheme", content: "dark" },
    { name: "theme-color", content: "#1E1F24" },
    { property: "og:title", content: "SK Platform | Documentation" },
    { property: "og:description", content: "SK Platform - your central hub for managing SK products, accounts, services and documentation." },
    { property: "og:url", content: "https://platform.stefankruik.com" },
    { property: "og:type", content: "website" },
];
useHead({
    title: "SK Platform",
    meta: metaItems,
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
