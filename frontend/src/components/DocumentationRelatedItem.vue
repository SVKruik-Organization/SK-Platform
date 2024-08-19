<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { RelatedItem } from '@/assets/customTypes';

export default defineComponent({
    name: "DocumentationRelatedItem",
    props: {
        "data": { type: Object as PropType<RelatedItem>, required: true },
    }
});
</script>

<template>
    <RouterLink :to="`/documentation/read/${data.type}/${data.category}/${data.page}`" class="related-item flex">
        <section class="related-item-left flex">
            <i :class="`fa-regular ${data.icon}`"></i>
        </section>
        <article class="related-item-right flex-col">
            <strong>{{ data.title }}</strong>
            <p class="related-description ellipsis">{{ data.description }}</p>
            <div class="related-sub flex">
                <a :href="data.type === 'Doc' ? '#Documentation' : '#Guides'" class="related-sub-item">
                    {{ data.type }}
                </a>
                <i class="fa-regular fa-circle-small related-sub-item"></i>
                <RouterLink :to="`/documentation/read/${data.type}/${data.category}`" class="related-sub-item">
                    {{ data.category.replace(/_/g, " ") }}
                </RouterLink>
            </div>
            <img v-if="data.image_url" :src="data.image_url">
        </article>
    </RouterLink>
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

.related-item-right img {
    position: absolute;
    left: 50%;
    height: 500px;
    aspect-ratio: 1 / 1;
    filter: blur(100px) saturate(300%) contrast(150%);
    top: 30px;
    transition: transform 0.5s, left 0.5s;
    -webkit-user-select: none;
    user-select: none;
    border-radius: 50%;
    will-change: transform, left;
    transform: translateX(20%);
}

.related-item:hover .related-item-right img {
    transform: translateX(0);
}

.related-sub-item {
    color: var(--font-light);
    font-size: small;
    position: sticky;
    z-index: 2;
}

.related-sub i {
    font-size: 10px;
}

@media (width <=990px) {
    .related-item {
        width: 100%;
    }
}
</style>
