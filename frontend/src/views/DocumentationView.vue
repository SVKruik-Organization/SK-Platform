<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import DocumentationNavbar from '../components/DocumentationNavbar.vue'
import type { DocumentationTypes, DropdownStates } from '@/assets/customTypes';

export default defineComponent({
    name: "DocumentationView",
    props: {
        "type": { type: String as PropType<DocumentationTypes>, required: false },
        "category": { type: String, required: false },
        "page": { type: String, required: false }
    },
    components: {
        DocumentationNavbar
    },
    data() {
        return {
            "versionDropdownVisible": false,
            "languageDropdownVisible": false,
            "informationDropdownVisible": false
        }
    },
    methods: {
        /**
         * Change the toggle state of a specific dropdown.
         * @param name Which dropdown state to update.
         * @param newValue The new value of the toggle.
         */
        updateDropdownState(name: DropdownStates, newValue: boolean) {
            this[name] = newValue;
        }
    },
    mounted() {
        // Toggle Dropdown
        document.addEventListener("click", event => {
            const target: HTMLElement = event.target as HTMLElement;
            if (target.classList.contains("disable-close")) return;
            if (target.tagName === "MENU") return;
            this.versionDropdownVisible = false;
            this.languageDropdownVisible = false;
            this.informationDropdownVisible = false;
        });
    }
});
</script>

<template>
    <DocumentationNavbar @dropdownState="updateDropdownState" :versionDropdownVisible="versionDropdownVisible"
        :languageDropdownVisible="languageDropdownVisible"></DocumentationNavbar>
    <main>
        <RouterView @dropdownState="updateDropdownState" :informationDropdownVisible="informationDropdownVisible">
        </RouterView>
    </main>
</template>

<style scoped></style>
