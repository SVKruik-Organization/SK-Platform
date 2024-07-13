<script lang="ts">
import type { DocumentationIndexItem, RecommendedItem } from '@/assets/customTypes';
import DocumentationRecommendedItem from '@/components/DocumentationRecommendedItem.vue';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "DocumentationHomePage",
    components: {
        DocumentationRecommendedItem
    },
    props: {
        "category": { type: String, required: false },
        "page": { type: String, required: false }
    },
    setup() {
        return {
            documentationStore: useDocumentationStore()
        }
    },
    data() {
        return {
            "docIndexItems": [] as Array<DocumentationIndexItem>,
            "recommendedDocItems": [] as Array<RecommendedItem>
        }
    },
    async mounted() {
        this.documentationStore.$subscribe((mutation, state) => {
            this.docIndexItems = state.docIndex;
            this.recommendedDocItems = state.recommendedDocItems;
        });
        this.docIndexItems = await this.documentationStore.getIndex(false, "Doc");
        this.recommendedDocItems = await this.documentationStore.getRecommendedItems(false, "Doc");
    }
});
</script>

<template>
    <section class="banner flex">
        <div class="banner-content flex hero">
            <div class="hero-left flex-col">
                <h1>Documentation</h1>
                <h3 class="content-splitter-header">Explore information about SK Platform and related product lines.
                </h3>
            </div>
            <div class="hero-right flex">
                <RouterLink to="/documentation/read/Doc/Products/First_Generation#Ciconia">
                    <img src="/Ciconia.png" class="hero-bot-image" title="Ciconia, first gen main production bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Interpres">
                    <img src="/Interpres.png" class="hero-bot-image" title="Interpres, GitHub API proxy bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Ispidina">
                    <img src="/Ispidina.png" class="hero-bot-image" title="Ispidina, TypeScript pioneer bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Stelleri">
                    <img src="/Stelleri.png" class="hero-bot-image" title="Stelleri, early-access features bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Doc/Products/Discord_Bots#Apricaria">
                    <img src="/Apricaria.png" class="hero-bot-image" title="Apricaria, second gen main production bot.">
                </RouterLink>
            </div>
        </div>
    </section>
    <section class="content-container">
        <div class="content-item">
            <h2 class="banner-content content-splitter-header">Recommended pages</h2>
            <div class="banner-content recommended-item-container flex">
                <DocumentationRecommendedItem
                    v-if="recommendedDocItems.length > 0 && recommendedDocItems[0].title !== 'Not_Found'"
                    v-for="recommendedDocItem of recommendedDocItems" type="Doc" :key="recommendedDocItem.id"
                    :data="recommendedDocItem"></DocumentationRecommendedItem>
                <article v-else-if="recommendedDocItems.length > 0 && recommendedDocItems[0].category === 'Not_Found'"
                    class="flex-col">
                    <p>Looks like there aren't any recommended docs available right now. This is likely due to your
                        language
                        and/or version settings.</p>
                    <p>Please change them to their defaults and try again.</p>
                </article>
                <div v-else>Something went wrong while retrieving the recommended docs. Please try again later.</div>
            </div>
        </div>
        <div class="content-item">
            <h2 class="banner-content content-splitter-header">Browse all categories</h2>
            <div class="banner-content category-container-parent flex">
                <div class="banner-content flex category-container"
                    v-if="docIndexItems.length > 0 && docIndexItems[0].category !== 'Not_Found'">
                    <menu class="category-item flex-col" v-for="docIndexItem of docIndexItems"
                        :key="docIndexItem.category">
                        <RouterLink class="flex category-header"
                            :to="`/documentation/read/Doc/${docIndexItem.category}`">
                            <i class=" fa-regular" :class="docIndexItem.category_icon"></i>
                            <h3>{{ docIndexItem.category.replace("_", " ") }}</h3>
                        </RouterLink>
                        <RouterLink v-for="child of docIndexItem.children"
                            :to="`/documentation/read/Doc/${docIndexItem.category}/${child}`">{{
                                child.replace("_", " ") }}</RouterLink>
                    </menu>
                </div>
                <article v-else-if="docIndexItems.length > 0 && docIndexItems[0].category === 'Not_Found'"
                    class="flex-col">
                    <p>Looks like there aren't any docs available right now. This is likely due to your language
                        and/or version settings.</p>
                    <p>Please change them to their defaults and try again.</p>
                </article>
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
    width: 100%;
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
    height: 290px;
    gap: 20px;
}

.category-item a {
    color: var(--link);
}

.hero {
    justify-content: space-between;
}

.hero-bot-image {
    border-radius: 50%;
    border: 1px solid var(--fill);
    aspect-ratio: 1 / 1;
    height: 150px;
    object-fit: cover;
    margin-left: -75px;
    user-select: none;
}

.recommended-item-container {
    flex-wrap: wrap;
    gap: 20px;
}

@media (width <=1280px) {
    .banner {
        padding: 10px;
    }

    .banner-content {
        width: 100%;
    }

    .category-container-parent {
        justify-content: center;
    }

    .content-item {
        width: 95%;
    }

    .recommended-item-container {
        justify-content: center;
    }

    .category-container {
        justify-content: center;
        width: 95%;
        margin-left: 12vw;
    }

    .content-splitter-header {
        text-align: center;
    }

    .hero {
        justify-content: space-evenly;
    }

    .hero-bot-image {
        height: 100px;
        margin-left: -50px;
    }
}

@media (width <=750px) {
    .category-item {
        width: 240px;
    }
}

@media (width <=1070px) {
    .hero {
        flex-direction: column;
        justify-content: center;
        gap: 30px;
        height: 100%;
    }

    .hero-left {
        width: 95%;
    }

    .hero-left h1,
    .hero-left h3 {
        width: 100%;
        text-align: center;
    }

    .hero-right {
        margin-right: -35px;
    }

    .hero-bot-image {
        height: 70px;
        margin-left: -35px;
    }
}

@media (width <=560px) {
    .category-container {
        gap: 40px;
    }

    .category-item {
        height: min-content;
    }
}
</style>
