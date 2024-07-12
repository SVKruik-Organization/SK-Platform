<script lang="ts">
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { fetchDocumentationDefault, fetchDocumentationPage } from '@/utils/fetch';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ReadPage",
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    data() {
        return {
            "html": true as string | boolean
        }
    },
    props: {
        "category": { type: String, required: true },
        "page": { type: String, required: false }
    },
    async mounted() {
        if (!this.category) return;

        // Category Landing Page
        if (!this.page) {
            if (!this.documentationStore.validateFolder(this.category)) return this.$router.push(`/documentation/notfound?category=${this.category}`);
            this.html = await fetchDocumentationDefault(this.category, this.documentationStore.version, this.documentationStore.language);

            // Specific Documentation Page
        } else {
            if (!this.documentationStore.validatePage(this.category, this.page)) return this.$router.push(`/documentation/notfound?category=${this.category}&page=${this.page}`);
            this.html = await fetchDocumentationPage(this.category, this.page, this.documentationStore.version, this.documentationStore.language);
        }
    }
});
</script>

<template>
    <div class="content-container flex-col">
        <h1>Documentation Read Page</h1>
        <div class="documentation-page" v-html="html" v-if="typeof html === 'string'"></div>
        <div v-else-if="html === true">Loading . . .</div>
        <div v-else>Something went wrong while retrieving the documentation page. Please try again later.</div>
    </div>
</template>

<style scoped></style>
