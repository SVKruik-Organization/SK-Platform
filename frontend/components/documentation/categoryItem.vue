<script setup lang="ts">
import { type PropType } from 'vue';
import type { DocumentationIndexItem } from '@/assets/customTypes';

// Props
defineProps({
    "data": { type: Object as PropType<DocumentationIndexItem>, required: true },
    "type": { type: String, required: true }
});
</script>

<template>
    <menu class="category-item flex-col">
        <NuxtLink class="flex category-header" :to="`/documentation/read/${type}/${data.category}`"
            title="Click to see category details and it's contents.">
            <NuxtImg class="icon" width="15" height="15" :src="`/svg/tailor/${data.categoryIcon}-regular.svg`"
                loading="lazy" alt="Icon" />
            <h4>{{ data.category.replace(/_/g, " ") }}</h4>
        </NuxtLink>
        <NuxtLink v-for="child of data.children.slice(0, 5)" title="Click to read this page."
            :to="`/documentation/read/${type}/${data.category}/${child}`">{{
                child.replace(/_/g, " ") }}</NuxtLink>
        <NuxtLink :to="`/documentation/read/${type}/${data.category}`" class="flex more-link"
            v-if="data.children.length > 5" title="See all pages for this category.">
            <NuxtImg class="icon" width="15" height="15" src="/svg/down-to-dotted-line-regular.svg" loading="lazy"
                alt="Icon" />
            <p class="small-text link-text">{{ data.children.length - 5 }} more</p>
        </NuxtLink>
    </menu>
</template>

<style scoped>
.category-item {
    width: 290px;
    height: 290px;
    gap: 20px;
}

.category-item a {
    color: var(--link);
}

.more-link:hover p {
    color: var(--font-light);
}

.more-link:hover .icon {
    filter: invert(0.7);
}

@media (width <=1280px) {
    .category-item:nth-child(1n+0) {
        width: 22vw;
    }

    .category-item:nth-child(3n+0) {
        width: 24vw;
    }
}

@media (width <=580px) {
    .category-item {
        height: min-content;
    }

    .category-item:nth-child(3n+0) {
        width: 0;
    }

    .category-item:nth-child(1n+0) {
        width: 34vw;
    }

    .category-item:nth-child(2n+0) {
        width: 40vw;
    }
}

@media (width <=360px) {
    .category-container {
        grid-template-columns: 1fr;
    }

    .category-item:nth-child(3n+0),
    .category-item:nth-child(2n+0) {
        width: 0;
    }

    .category-item:nth-child(1n+0) {
        width: 70vw;
    }
}
</style>
