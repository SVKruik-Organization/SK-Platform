<script setup lang="ts">
import type { FeaturedItem } from "@/assets/customTypes";

// Props
defineProps<{
    data: FeaturedItem;
}>();
</script>

<template>
    <NuxtLink
        :to="`/documentation/read/${data.type}/${data.category}/${data.page}${data.anchor ? `#${data.anchor}` : ''}`"
        class="featured-item flex">
        <section class="featured-item-left flex">
            <NuxtImg class="icon" width="15" height="15" :src="`/svg/tailor/${data.icon}-regular.svg`" loading="lazy"
                alt="Icon" />
        </section>
        <article class="featured-item-right flex-col">
            <p class="featured-title ellipsis">{{ data.page.replace(/_/g, " ") }}</p>
            <div class="featured-sub flex">
                <NuxtLink :to="data.type === 'Doc' ? '/documentation#Information' : '/documentation#Guides'"
                    class="featured-sub-item">
                    {{ data.type }}
                </NuxtLink>
                <NuxtImg class="icon icon-light featured-sub-item" width="10" height="10"
                    src="/svg/circle-small-regular.svg" loading="lazy" alt="Icon" />
                <NuxtLink :to="`/documentation/read/${data.type}/${data.category}`" class="featured-sub-item">
                    {{ data.category.replace(/_/g, " ") }}
                </NuxtLink>
                <NuxtImg class="icon icon-light featured-sub-item" width="10" height="10"
                    v-if="typeof data.time === 'number'" src="/svg/circle-small-regular.svg" loading="lazy"
                    alt="Icon" />
                <p class="featured-sub-item" v-if="typeof data.time === 'number'">{{ data.time }} min read</p>
            </div>
        </article>
    </NuxtLink>
</template>

<style scoped>
.featured-item {
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
    width: 49%;
    height: 60px;
    gap: 0;
}

.featured-title {
    width: 95%;
}

.featured-item-left {
    height: 100%;
    width: 40px;
    justify-content: center;
    background-color: var(--fill-light);
    border-top-left-radius: calc(var(--border-radius-low) - 2px);
    border-bottom-left-radius: calc(var(--border-radius-low) - 2px);
}

.featured-item-right {
    height: 100%;
    justify-content: center;
    flex: 1;
    padding-left: 15px;
    border-top-right-radius: var(--border-radius-low);
    border-bottom-right-radius: var(--border-radius-low);
    transition: background-color 0.5s;
    overflow: hidden;
}

.featured-item:hover .featured-item-right {
    background-color: var(--fill-light);
}

.featured-sub-item {
    color: var(--font-light);
    font-size: small;
    position: sticky;
    z-index: 2;
}

@media (width <=1280px) {
    .featured-item {
        width: 100%;
        max-width: 500px;
    }
}

@media (width <=310px) {
    .featured-item-left {
        width: 30px;
    }

    .featured-item-right {
        padding-left: 5px;
    }

    .featured-sub {
        gap: 2px;
    }
}
</style>
