<script lang="ts">
import { defineComponent } from 'vue';
import DocumentationNavbar from '../components/DocumentationNavbar.vue'

export default defineComponent({
    name: "DocumentationView",
    props: {
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
