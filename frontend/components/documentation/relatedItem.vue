<script setup lang="ts">
import { type PropType } from 'vue';
import type { RelatedItem } from '@/assets/customTypes';

// Props
defineProps({
    "data": { type: Object as PropType<RelatedItem>, required: true },
});
</script>

<template>
    <NuxtLink :to="`/documentation/read/${data.type}/${data.category}/${data.page}`" class="related-item flex">
        <section class="related-item-left flex">
            <NuxtImg class="icon" width="15" height="15" :src="`/svg/tailor/${data.icon}-regular.svg`" loading="lazy"
                alt="Icon" />
        </section>
        <article class="related-item-right flex-col">
            <strong>{{ data.page.replace(/_/g, " ") }}</strong>
            <div class="related-sub flex">
                <NuxtLink :to="data.type === 'Doc' ? '/documentation#Information' : '/documentation#Guides'"
                    class="related-sub-item">
                    {{ data.type }}
                </NuxtLink>
                <NuxtImg class="icon icon-light recommended-sub-item" width="10" height="10"
                    src="/svg/circle-small-regular.svg" loading="lazy" alt="Icon" />
                <NuxtLink :to="`/documentation/read/${data.type}/${data.category}`" class="related-sub-item">
                    {{ data.category.replace(/_/g, " ") }}
                </NuxtLink>
            </div>
            <NuxtImg v-if="data.imageUrl" height="500" width="500" class="product-image" :src="data.imageUrl"
                alt="Related Product Image" loading="lazy" />
        </article>
    </NuxtLink>
</template>

<style scoped>
.related-item {
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
    width: 49%;
    height: 80px;
    gap: 0;
}

.related-description {
    width: 95%;
    font-size: 14px;
}

.related-item-left {
    height: 100%;
    width: 40px;
    justify-content: center;
    background-color: var(--fill-light);
    border-top-left-radius: calc(var(--border-radius-low) - 2px);
    border-bottom-left-radius: calc(var(--border-radius-low) - 2px);
}

.related-item-right {
    position: relative;
    height: 100%;
    justify-content: center;
    flex: 1;
    padding-left: 15px;
    border-top-right-radius: var(--border-radius-low);
    border-bottom-right-radius: var(--border-radius-low);
    overflow: hidden;
    z-index: 1;
}

.related-item-right > strong,
.related-item-right > p,
.related-item-right > div {
    z-index: 1;
}

.related-item-right .product-image {
    position: absolute;
    left: 50%;
    filter: blur(100px) saturate(300%) contrast(150%);
    top: 30px;
    transition: transform 0.5s, left 0.5s;
    -webkit-user-select: none;
    user-select: none;
    border-radius: 50%;
    will-change: transform, left;
    transform: translateX(20%);
}

.related-item:hover .related-item-right .product-image {
    transform: translateX(0);
}

.related-sub-item {
    color: var(--font-light);
    font-size: small;
    position: sticky;
    z-index: 2;
}

@media (width <=990px) {
    .related-item {
        width: 100%;
    }
}
</style>
