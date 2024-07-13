<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { RecommendedItem } from '@/assets/customTypes';

export default defineComponent({
    name: "DocumentationRecommendedItem",
    emits: [
        "scrollAnchor"
    ],
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
                <RouterLink :to="`/documentation${data.type === 'Doc' ? '#Documentation' : '#Guides'}`"
                    @click="$emit('scrollAnchor', data.type)" class="recommended-sub-item">
                    {{ data.type }}
                </RouterLink>
                <i class="fa-regular fa-circle-small recommended-sub-item"></i>
                <RouterLink :to="`/documentation/read/${data.type}/${data.category}`" class="recommended-sub-item">
                    {{ data.category.replace("_", " ") }}
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
    gap: 15px;
    height: 60px;
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
}

.recommended-sub-item {
    color: var(--font-light);
    font-size: small;
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
