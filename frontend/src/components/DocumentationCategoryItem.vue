<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { DocumentationIndexItem } from '@/assets/customTypes';

export default defineComponent({
    name: "DocumentationCategoryItem",
    props: {
        "type": { type: String, required: true },
        "data": { type: Object as PropType<DocumentationIndexItem>, required: true },
    },
});
</script>

<template>
    <menu class="category-item flex-col">
        <RouterLink class="flex category-header" :to="`/documentation/read/${type}/${data.category}`">
            <i class=" fa-regular" :class="data.category_icon"></i>
            <h4>{{ data.category.replace("_", " ") }}</h4>
        </RouterLink>
        <RouterLink v-for="child of data.children" :to="`/documentation/read/${type}/${data.category}/${child}`">{{
            child.replace("_", " ") }}</RouterLink>
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
