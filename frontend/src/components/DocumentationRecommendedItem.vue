<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { RecommendedItem } from '@/assets/customTypes';

export default defineComponent({
    name: "DocumentationRecommendedItem",
    props: {
        "data": { type: Object as PropType<RecommendedItem>, required: true },
    },
});
</script>

<template>
    <RouterLink :to="`/documentation/read/${data.type}/${data.category}/${data.page}${data.anchor}`"
        class="recommended-item flex">
        <section class="recommended-item-left flex">
            <i :class="`fa-regular ${data.icon}`"></i>
        </section>
        <article class="recommended-item-right flex-col">
            <p class="recommended-title">{{ data.title }}</p>
            <div class="recommended-sub flex">
                <a :href="data.type === 'Doc' ? '#Documentation' : '#Guides'" class="recommended-sub-item">
                    {{ data.type }}
                </a>
                <i class="fa-regular fa-circle-small recommended-sub-item"></i>
                <RouterLink :to="`/documentation/read/${data.type}/${data.category}`" class="recommended-sub-item">
                    {{ data.category.replace(/_/g, " ") }}
                </RouterLink>
                <i class="fa-regular fa-circle-small recommended-sub-item"></i>
                <p class="recommended-sub-item">{{ data.time }} min read</p>
            </div>
        </article>
    </RouterLink>
</template>

<style scoped>
.recommended-item {
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
    width: 49%;
    height: 60px;
    gap: 0;
}

.recommended-item-left {
    height: 100%;
    width: 40px;
    justify-content: center;
    background-color: var(--fill-light);
}

.recommended-item-right {
    height: 100%;
    justify-content: center;
    flex: 1;
    padding: 0 0 0 15px;
    border-top-right-radius: var(--border-radius-low);
    border-bottom-right-radius: var(--border-radius-low);
    transition: background-color 0.5s;
}

.recommended-item:hover .recommended-item-right {
    background-color: var(--border);
}

.recommended-sub-item {
    color: var(--font-light);
    font-size: small;
    position: sticky;
    z-index: 2;
}

.recommended-sub i {
    font-size: 10px;
}

@media (width <=1280px) {
    .recommended-item {
        width: 100%;
        max-width: 500px;
    }
}
</style>
