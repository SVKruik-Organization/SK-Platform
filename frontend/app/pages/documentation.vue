<script setup lang="ts">
import type { DocumentationTypes, DropdownStates } from "@/assets/customTypes";
import { useDocumentationStore } from "@/stores/DocumentationStore";

// Setup
const documentationStore = useDocumentationStore();

// Props
defineProps<{
    type?: DocumentationTypes;
    category?: string;
    page?: string;
}>();

// Reactive Data
const versionDropdownVisible: Ref<boolean> = ref(false);
const languageDropdownVisible: Ref<boolean> = ref(false);
const informationDropdownVisible: Ref<boolean> = ref(false);
const productDropdownVisible: Ref<boolean> = ref(false);
const navigationDropdownVisible: Ref<boolean> = ref(false);
const commentOverlayVisible: Ref<boolean> = ref(false);
const themeDropdownVisible: Ref<boolean> = ref(false);
const dropdownStates = {
    versionDropdownVisible,
    languageDropdownVisible,
    informationDropdownVisible,
    productDropdownVisible,
    navigationDropdownVisible,
    commentOverlayVisible,
    themeDropdownVisible
};

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

/**
 * Updates the dropdown state.
 * @param name The name of the dropdown state to update.
 * @param newValue The new value to set the dropdown state to.
 */
function updateDropdownState(name: DropdownStates, newValue: boolean): void {
    if (dropdownStates[name]) dropdownStates[name].value = newValue;
}

// Lifecycle
onMounted(() => {
    // Toggle Dropdown
    document.addEventListener("click", event => {
        const target: HTMLElement = event.target as HTMLElement;
        if (target.classList.contains("disable-close")) return;
        if (target.tagName === "MENU" || target.tagName === "SPAN") return;

        versionDropdownVisible.value = false;
        languageDropdownVisible.value = false;
        informationDropdownVisible.value = false;
        productDropdownVisible.value = false;
        navigationDropdownVisible.value = false;
        commentOverlayVisible.value = false;
        themeDropdownVisible.value = false;
    });

    // Load Theme
    const theme: string = documentationStore.theme;
    if (theme) document.documentElement.classList.add(theme.toLowerCase());
});
</script>

<template>
    <div>
        <DocumentationNavbar @dropdown-state="updateDropdownState" :version-dropdown-visible="versionDropdownVisible"
            :language-dropdown-visible="languageDropdownVisible" :theme-dropdown-visible="themeDropdownVisible" />
        <main>
            <NuxtPage @dropdown-state="updateDropdownState" :informationDropdownVisible="informationDropdownVisible"
                :productDropdownVisible="productDropdownVisible" :navigationDropdownVisible="navigationDropdownVisible"
                :commentOverlayVisible="commentOverlayVisible" />
        </main>
    </div>
</template>
