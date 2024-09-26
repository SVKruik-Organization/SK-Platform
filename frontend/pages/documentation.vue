<script setup lang="ts">
import { type PropType } from 'vue';
import DocumentationNavbar from '../components/documentation/navbar.vue'
import type { DocumentationTypes, DropdownStates } from '@/assets/customTypes';

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
        if (target.tagName === "MENU" || target.tagName === "SPAN") return;

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
        <DocumentationNavbar @dropdown-state="updateDropdownState" :version-dropdown-visible="versionDropdownVisible"
            :language-dropdown-visible="languageDropdownVisible" />
        <main>
            <NuxtPage @dropdown-state="updateDropdownState" :informationDropdownVisible="informationDropdownVisible"
                :productDropdownVisible="productDropdownVisible" :navigationDropdownVisible="navigationDropdownVisible"
                :commentOverlayVisible="commentOverlayVisible" />
        </main>
    </div>
</template>
