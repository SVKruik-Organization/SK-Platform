<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import DocumentationNavbar from '../components/DocumentationNavbar.vue'
import type { DocumentationTypes } from '@/assets/customTypes';

export default defineComponent({
    name: "DocumentationView",
    props: {
        "type": { type: String as PropType<DocumentationTypes>, required: false },
        "category": { type: String, required: false },
        "page": { type: String, required: false }
    },
    components: {
        DocumentationNavbar
    }
});
</script>

<template>
    <DocumentationNavbar></DocumentationNavbar>
    <main>
        <RouterView></RouterView>
    </main>
</template>

<style scoped></style>
