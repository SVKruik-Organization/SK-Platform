<script lang="ts">
import { defineComponent } from 'vue';
import DocumentationNavbar from '../components/DocumentationNavbar.vue'

export default defineComponent({
    name: "DocumentationView",
    props: {
        "category": String,
        "page": String
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
