<script lang="ts">
import type { DocumentationIndexItem } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationHomePage",
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    data() {
        return {
            "indexItems": [] as Array<DocumentationIndexItem>
        }
    },
    async mounted() {
        this.indexItems = await this.documentationStore.getIndex("v1", "en-US");
    }
});
</script>

<template>
    <section class="banner flex">
        <div class="banner-content flex-col">
            <h1>Documentation</h1>
        </div>
    </section>
    <section class="content-container">
        <div class="content-item">
            <h2 class="banner-content content-splitter-header">Recommended pages</h2>
            <div class="banner-content">
                <p>Come back later for these.</p>
            </div>
        </div>
        <div class="content-item">
            <h2 class="banner-content content-splitter-header">Browse all categories</h2>
            <div class="banner-content">
                <div class="banner-content flex category-container" v-if="indexItems.length">
                    <menu class="category-item flex-col" v-for="indexItem of indexItems" :key="indexItem.category">
                        <div class="flex category-header">
                            <i class="fa-regular" :class="indexItem.category_icon"></i>
                            <h3>{{ indexItem.category.replace("_", " ") }}</h3>
                        </div>
                        <RouterLink v-for="child of indexItem.children"
                            :to="`/documentation/read/${indexItem.category}/${child}`">{{
                                child.replace("_", " ") }}</RouterLink>
                    </menu>
                </div>
                <div v-else>Something went wrong while retrieving the documentation index. Please try again later.</div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.banner {
    width: 100%;
    background-color: var(--fill);
    height: 300px;
    box-sizing: border-box;
    padding: 40px;
    justify-content: center;
}

h1 {
    font-size: xx-large;
}

.content-splitter-header {
    color: var(--font-light);
    font-weight: 500;
}

.content-container,
.content-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: unset;
    margin-top: 40px;
    gap: 40px;
}

.content-item {
    gap: 30px;
}

.banner-content {
    width: 1200px;
}

.category-container {
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}

.category-header {
    gap: 15px;
}

.category-item {
    width: 290px;
    height: 350px;
    gap: 20px;
}

.category-item a {
    color: var(--link);
}

@media (width <=1280px) {
    .banner {
        padding: 10px;
    }

    .banner-content {
        width: 95%;
    }
}
</style>
