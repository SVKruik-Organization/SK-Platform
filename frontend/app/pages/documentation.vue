<script setup lang="ts">
import type { DocumentationTypes } from "@/assets/customTypes";
import { useDocumentationStore } from "@/stores/DocumentationStore";

// Setup
const documentationStore = useDocumentationStore();

// Props
defineProps<{
    type?: DocumentationTypes;
    category?: string;
    page?: string;
}>();

// SEO
const metaItems = [
    // Base
    { name: "description", content: "The documentation for the SK Platform. Learn how to use the platform, its products, and services." },
    { property: "og:title", content: "SK Docs - The documentation for the SK Platform. Learn how to use the platform, its products, and services." },
    { property: "og:description", content: "The documentation for the SK Platform. Learn how to use the platform, its products, and services." },

    // Image
    { property: "og:image", content: "https://files.stefankruik.com/Products/1280/Docs.png" },
    { property: "og:image:alt", content: "The SK Docs logo." },
    { property: "twitter:image", content: "https://files.stefankruik.com/Products/1280/Docs.png" },

    // Twitter
    { property: "twitter:title", content: "SK Docs - The documentation for the SK Platform. Learn how to use the platform, its products, and services." },
    { property: "twitter:description", content: "The documentation for the SK Platform. Learn how to use the platform, its products, and services." },

    // Type
    { property: "og:type", content: "article" },
    { property: "article:author", content: "https://github.com/SVKruik" },
    { property: "article:section", content: "Documentation" },
];
useHead({
    meta: metaItems
});

// Methods

// Lifecycle
onMounted(() => {
    // Load Theme
    const theme: string = documentationStore.theme;
    if (theme) document.documentElement.classList.add(theme.toLowerCase());
});
</script>

<template>
    <div>
        <DocumentationNavbar />
        <main>
            <NuxtPage />
        </main>
    </div>
</template>
