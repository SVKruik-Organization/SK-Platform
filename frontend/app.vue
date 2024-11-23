<script setup lang="ts">
import "~/assets/css/base.css";
import "~/assets/css/docpage.css";
import "~/assets/css/interaction.css";
import "~/assets/css/documentation.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

// Setup
const route = useRoute();
const documentationStore = useDocumentationStore();

// SEO
const metaItems = [
    // Base
    { name: "description", content: "The place where SK Platform and its sub-products come together." },
    { property: "og:title", content: "SK Platform - The place where SK Platform and its sub-products come together." },
    { property: "og:description", content: "The place where SK Platform and its sub-products come together." },

    // Image
    { property: "og:image", content: "https://files.stefankruik.com/Products/1280/Platform.png" },
    { property: "og:image:alt", content: "The SK Platform logo." },
    { property: "twitter:image", content: "https://files.stefankruik.com/Products/1280/Platform.png" },

    // Twitter
    { property: "twitter:title", content: "SK Platform - The place where SK Platform and its sub-products come together." },
    { property: "twitter:description", content: "The place where SK Platform and its sub-products come together." },

    // Type
    { property: "og:type", content: "website" }
];
useHead({
    meta: metaItems,
    htmlAttrs: {
        lang: documentationStore.language.split("-")[0] || "en"
    }
});

// Lifecycle
onMounted(() => {
    metaUpdater(route.path);
});

// Watchers
watch(() => route.path, (to: string) => metaUpdater(to));

// Methods

/**
 * Updates several 'things' around the website conforming to the new route.
 * @param route The route to use for updating.
 */
function metaUpdater(newRoute: string): void {
    const split: Array<string> = newRoute.split("/");
    if (split[1].length) {
        const join: string = split.slice(0).map((string) => ((string.charAt(0).toUpperCase() + string.slice(1))).replace(/_/g, " ")).join(" | ");
        document.title = `SK Platform ${join}`;
    } else document.title = "SK Platform";

    // Open Graph URL
    const ogUrl: HTMLMetaElement | null = document.querySelector("meta[property='og:url']");
    if (ogUrl) {
        ogUrl.setAttribute("content", window.location.href);
    } else {
        const newOgUrl: HTMLMetaElement = document.createElement("meta");
        newOgUrl.setAttribute("property", "og:url");
        newOgUrl.setAttribute("content", window.location.href);
        document.head.appendChild(newOgUrl);
    }

    // Twitter URL
    const twitterUrl: HTMLMetaElement | null = document.querySelector("meta[property='twitter:url']");
    if (twitterUrl) {
        twitterUrl.setAttribute("content", window.location.href);
    } else {
        const newTwitterUrl: HTMLMetaElement = document.createElement("meta");
        newTwitterUrl.setAttribute("property", "twitter:url");
        newTwitterUrl.setAttribute("content", window.location.href);
        document.head.appendChild(newTwitterUrl);
    }

    // Apple Touch Icon
    const icon = document.querySelector("link[rel='apple-touch-icon']");
    const imageName: string = split[1] === "documentation" ? "Docs" : "Platform";
    if (icon) {
        icon.setAttribute("href", `/seo/apple/${imageName}.png`);
    } else {
        const newImage = document.createElement("link");
        newImage.setAttribute("rel", "apple-touch-icon");
        newImage.setAttribute("href", `/seo/apple/${imageName}.png`);
        document.head.appendChild(newImage);
    }

    // Favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
        favicon.setAttribute("href", `/seo/favicon/${imageName}.ico`);
        favicon.setAttribute("type", "image/x-icon");
    } else {
        const newFavicon = document.createElement("link");
        newFavicon.setAttribute("rel", "icon");
        newFavicon.setAttribute("href", `/seo/favicon/${imageName}.ico`);
        document.head.appendChild(newFavicon);
    }

    // Shortcut Icon
    const shortcut = document.querySelector("link[rel='shortcut icon']");
    if (shortcut) {
        shortcut.setAttribute("href", `/seo/apple/${imageName}.png`);
    } else {
        const newShortcut = document.createElement("link");
        newShortcut.setAttribute("rel", "shortcut icon");
        newShortcut.setAttribute("href", `/seo/apple/${imageName}.png`);
        document.head.appendChild(newShortcut);
    }

    // Theme Color
    if (split[1] !== "documentation") {
        document.documentElement.className = "";
    } else documentationStore.setTheme(null);
}
</script>

<template>
    <Toast />
    <NuxtPage />
</template>
