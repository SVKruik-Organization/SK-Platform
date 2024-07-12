<script lang="ts">
import type { DocumentationIndexItem } from '@/assets/customTypes';
import { useDocumentationStore } from '@/stores/DocumentationStore';
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';

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
    computed: {
        ...mapStores(useDocumentationStore)
    },
    watch: {
        // WIP - Does not yet work.
        documentationStore(newIndex, oldIndex) {
            console.log(newIndex, oldIndex);
        }
    },
    async mounted() {
        this.indexItems = this.documentationStore.index;
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
                <RouterLink to="/documentation/read/Products/First_Generation#Ciconia">
                    <img src="/Ciconia.png" class="hero-bot-image" title="Ciconia, first gen main production bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Products/Discord_Bots#Interpres">
                    <img src="/Interpres.png" class="hero-bot-image" title="Interpres, GitHub API proxy bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Products/Discord_Bots#Ispidina">
                    <img src="/Ispidina.png" class="hero-bot-image" title="Ispidina, TypeScript pioneer bot.">
                </RouterLink>
                <RouterLink to="/documentation/read/Products/Discord_Bots#Stelleri">
                    <img src="/Stelleri.png" class="hero-bot-image" title="Stelleri, early-access features bot.">
                </RouterLink>
                <RouterLink to=" /documentation/read/Products/Discord_Bots#Apricaria">
                    <img src="/Apricaria.png" class="hero-bot-image" title="Apricaria, second gen main production bot.">
                </RouterLink>
            </div>
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
            <div class="banner-content category-container-parent flex">
                <div class="banner-content flex category-container" v-if="indexItems.length">
                    <menu class="category-item flex-col" v-for="indexItem of indexItems" :key="indexItem.category">
                        <RouterLink class="flex category-header" :to="`/documentation/read/${indexItem.category}`">
                            <i class=" fa-regular" :class="indexItem.category_icon"></i>
                            <h3>{{ indexItem.category.replace("_", " ") }}</h3>
                        </RouterLink>
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
    border: 1px solid var(--border);
    aspect-ratio: 1 / 1;
    height: 150px;
    object-fit: cover;
    margin-left: -75px;
    user-select: none;
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
