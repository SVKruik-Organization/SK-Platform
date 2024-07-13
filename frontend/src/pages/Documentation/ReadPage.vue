<script lang="ts">
import type { DocumentationTypes } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { fetchDocumentationDefault, fetchDocumentationPage } from '@/utils/fetch';
import { defineComponent, type PropType } from 'vue';

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
        "type": { type: String as PropType<DocumentationTypes>, required: true },
        "category": { type: String, required: true },
        "page": { type: String, required: false }
    },
    watch: {
        async $route() {
            if (!this.page) {
                this.html = await fetchDocumentationDefault(this.category, this.documentationStore.version, this.documentationStore.language, this.type);
            } else this.html = await fetchDocumentationPage(this.category, this.page, this.documentationStore.version, this.documentationStore.language, this.type);
        }
    },
    async mounted() {
        if (!this.type || !this.category) return;

        // Category Landing Page
        if (!this.page) {
            if (!this.documentationStore.validateFolder(this.category, this.type)) return this.$router.push(`/documentation/notfound?type=${this.type}&category=${this.category}`);
            this.html = await fetchDocumentationDefault(this.category, this.documentationStore.version, this.documentationStore.language, this.type);

            // Specific Documentation Page
        } else {
            if (!this.documentationStore.validatePage(this.category, this.page, this.type)) return this.$router.push(`/documentation/notfound?type=${this.type}&category=${this.category}&page=${this.page}`);
            this.html = await fetchDocumentationPage(this.category, this.page, this.documentationStore.version, this.documentationStore.language, this.type);
        }
    }
});
</script>

<template>
    <div class="content-wrapper flex">
        <nav class="flex-col">
            <p style="margin-bottom: 20px;">Other pages in {{ category }}</p>
            <RouterLink :to="`/documentation/read/${type}/${category}/${link}`"
                v-for="link in documentationStore.getCategoryList(type, category)">
                {{ link.replace("_", " ") }}
            </RouterLink>
        </nav>
        <div class="flex-col documentation-content-wrapper">
            <section class="flex-col documentation-content-parent">
                <div class="breadcrumbs-container flex">
                    <RouterLink :to="`/documentation${type === 'Doc' ? '#Documentation' : '#Guides'}`"
                        class="breadcrumb-item breadcrumb-link">
                        {{ type }}
                    </RouterLink>
                    <p>/</p>
                    <RouterLink :to="`/documentation/read/${type}/${category}`" class="breadcrumb-item breadcrumb-link">
                        {{ category }}
                    </RouterLink>
                    <p v-if="page">/</p>
                    <p v-if="page" class="breadcrumb-item">
                        {{ page }}
                    </p>
                </div>
                <section class="flex documentation-content-container">
                    <div class="documentation-content-child">
                        <p v-html="html"></p>

                    </div>
                    <aside>
                        <p>Aside</p>
                    </aside>
                </section>
            </section>
        </div>
    </div>
</template>

<style scoped>
.content-wrapper {
    align-items: flex-start;
    gap: 0;
}

nav {
    width: 300px;
    border-right: 1px solid var(--border);
    height: calc(100vh - 56px)
}

.documentation-content-wrapper {
    align-items: center;
    flex: 1;
    margin-left: -10vw;
}

.documentation-content-parent {
    flex: 1;
    align-items: center;
    justify-content: center;
    height: 100%;
    box-sizing: border-box;
    padding: 40px 40px;
    gap: 40px;
}

.breadcrumbs-container {
    width: 750px;
}

.documentation-content-container {
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    gap: 0;
}

.documentation-content-child {
    width: 600px;
}

aside {
    position: sticky;
    top: 120px;
    width: 150px;
    height: 600px;
}
</style>
