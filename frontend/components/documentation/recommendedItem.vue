<script setup lang="ts">
import { type PropType } from 'vue';
import type { RecommendedItem } from '@/assets/customTypes';

// Props
defineProps({
    "data": { type: Object as PropType<RecommendedItem>, required: true },
});
</script>

<template>
    <NuxtLink
        :to="`/documentation/read/${data.type}/${data.category}/${data.page}${data.anchor ? `#${data.anchor}` : ''}`"
        class="recommended-item flex">
        <section class="recommended-item-left flex">
            <i :class="`fa-regular ${data.icon}`"></i>
        </section>
        <article class="recommended-item-right flex-col">
            <p class="recommended-title ellipsis">{{ data.page.replace(/_/g, " ") }}</p>
            <div class="recommended-sub flex">
                <NuxtLink :to="data.type === 'Doc' ? '/documentation#Information' : '/documentation#Guides'"
                    class="recommended-sub-item">
                    {{ data.type }}
                </NuxtLink>
                <i class="fa-regular fa-circle-small recommended-sub-item"></i>
                <NuxtLink :to="`/documentation/read/${data.type}/${data.category}`" class="recommended-sub-item">
                    {{ data.category.replace(/_/g, " ") }}
                </NuxtLink>
                <i class="fa-regular fa-circle-small recommended-sub-item" v-if="typeof data.time === 'number'"></i>
                <p class="recommended-sub-item" v-if="typeof data.time === 'number'">{{ data.time }} min read</p>
            </div>
        </article>
    </NuxtLink>
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

.recommended-title {
    width: 95%;
}

.recommended-item-left {
    height: 100%;
    width: 40px;
    justify-content: center;
    background-color: var(--fill-light);
    border-top-left-radius: calc(var(--border-radius-low) - 2px);
    border-bottom-left-radius: calc(var(--border-radius-low) - 2px);
}

.recommended-item-right {
    height: 100%;
    justify-content: center;
    flex: 1;
    padding-left: 15px;
    border-top-right-radius: var(--border-radius-low);
    border-bottom-right-radius: var(--border-radius-low);
    transition: background-color 0.5s;
    overflow: hidden;
}

.recommended-item:hover .recommended-item-right {
    background-color: var(--fill-light);
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

@media (width <=310px) {
    .recommended-item-left {
        width: 30px;
    }

    .recommended-item-right {
        padding-left: 5px;
    }

    .recommended-sub {
        gap: 2px;
    }
}
</style>
