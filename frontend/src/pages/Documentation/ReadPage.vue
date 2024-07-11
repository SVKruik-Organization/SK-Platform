<script lang="ts">
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ReadPage",
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    props: {
        "category": String,
        "page": String
    },
    mounted() {
        // Category Landing Page
        if (!this.page) {
            if (!this.documentationStore.validateFolder(this.category)) return this.$router.push(`/documentation/notfound?category=${this.category}`);

            // Specific Documentation Page
        } else {
            if (!this.documentationStore.validatePage(this.category, this.page)) return this.$router.push(`/documentation/notfound?category=${this.category}&page=${this.page}`);
        }
    }
});
</script>

<template>
    <div class="content-container flex-col">
        <h1>Documentation Read Page</h1>
    </div>
</template>

<style scoped></style>
