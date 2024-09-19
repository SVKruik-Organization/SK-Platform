<script setup lang="ts">
import { type PropType } from 'vue';
import DocumentationNavbar from '../components/documentation/navbar.vue'
import type { DocumentationTypes, DropdownStates } from '@/assets/customTypes';
import type { RouteLocation } from 'vue-router';

// Props
defineProps({
    "type": { type: String as PropType<DocumentationTypes>, required: false },
    "category": { type: String, required: false },
    "page": { type: String, required: false }
});

// Reactive Data
const versionDropdownVisible: Ref<boolean> = ref(false);
const languageDropdownVisible: Ref<boolean> = ref(false);
const informationDropdownVisible: Ref<boolean> = ref(false);
const productDropdownVisible: Ref<boolean> = ref(false);
const navigationDropdownVisible: Ref<boolean> = ref(false);
const commentOverlayVisible: Ref<boolean> = ref(false);
const dropdownStates = {
    versionDropdownVisible,
    languageDropdownVisible,
    informationDropdownVisible,
    productDropdownVisible,
    navigationDropdownVisible,
    commentOverlayVisible
};

// Watchers
watch(useRoute(), (from: RouteLocation, to: RouteLocation) => {
    setTimeout(() => {
        if (from.path !== to.path) window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 300);
});

// Methods

/**
 * Updates the dropdown state.
 * @param name The name of the dropdown state to update.
 * @param newValue The new value to set the dropdown state to.
 */
function updateDropdownState(name: DropdownStates, newValue: boolean): void {
    if (dropdownStates[name]) {
        dropdownStates[name].value = newValue;
    }
}

// Lifecycle
onMounted(() => {
    // Toggle Dropdown
    document.addEventListener("click", event => {
        const target: HTMLElement = event.target as HTMLElement;
        if (target.classList.contains("disable-close")) return;
        if (target.tagName === "MENU" || target.tagName === "SPAN" || target.tagName === "NAV") return;
        versionDropdownVisible.value = false;
        languageDropdownVisible.value = false;
        informationDropdownVisible.value = false;
        productDropdownVisible.value = false;
        navigationDropdownVisible.value = false;
        commentOverlayVisible.value = false;
    });
});
</script>

<template>
    <div>
        <DocumentationNavbar @dropdownState="updateDropdownState" :versionDropdownVisible="versionDropdownVisible"
            :languageDropdownVisible="languageDropdownVisible" />
        <main>
            <NuxtPage @dropdownState="updateDropdownState" :informationDropdownVisible="informationDropdownVisible"
                :productDropdownVisible="productDropdownVisible" :navigationDropdownVisible="navigationDropdownVisible"
                :commentOverlayVisible="commentOverlayVisible" />
        </main>
    </div>
</template>
